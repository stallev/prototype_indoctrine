'use client';

import { useEffect, useState, type FormEvent } from 'react';

import { verifyImageGeneratorKey } from '@/app/tools/image-generator/actions';
import { Button } from '@/components/ui/button';
import { messages } from '@/lib/messages';

const STORAGE_KEY = 'image-generator-access-key';
const STORAGE_TTL_MS = 60 * 24 * 60 * 60 * 1000; // ~2 месяца

interface StoredAccess {
  key: string;
  storedAt: number;
}

// Дискриминированное объединение вместо независимых булевых —
// hooks-and-state.md §1.
type AccessState = { status: 'checking' } | { status: 'locked'; error?: string } | { status: 'unlocked' };

function readStoredKey(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAccess;
    if (typeof parsed.key !== 'string' || Date.now() - parsed.storedAt > STORAGE_TTL_MS) return null;
    return parsed.key;
  } catch {
    return null;
  }
}

interface ImageGeneratorAccessGateProps {
  children: React.ReactNode;
}

/**
 * Gate на общем секрете для личного/внутреннего инструмента (не
 * полноценная многопользовательская авторизация) — image-generator-tool-spec.md
 * §6. Верное значение ключа хранится в `localStorage` до 2 месяцев; при
 * каждом открытии страницы оно повторно сверяется с текущим
 * `SECURITY_IMAGE_GENERATOR_KEY` через Server Action (значение переменной
 * окружения никогда не покидает сервер) — так ловится и протухание
 * хранения, и ротация ключа на сервере.
 */
export const ImageGeneratorAccessGate = ({ children }: ImageGeneratorAccessGateProps) => {
  const [state, setState] = useState<AccessState>({ status: 'checking' });
  const [input, setInput] = useState('');

  useEffect(() => {
    let cancelled = false;
    const stored = readStoredKey();
    const verified = stored ? verifyImageGeneratorKey(stored) : Promise.resolve(false);

    // Все переходы `setState` — внутри callback'а промиса, не синхронно в
    // теле эффекта (react-hooks/set-state-in-effect); `cancelled` защищает
    // от установки состояния после размонтирования, если отклик придёт позже.
    verified.then((valid) => {
      if (cancelled) return;
      if (valid) {
        setState({ status: 'unlocked' });
        return;
      }
      if (stored) localStorage.removeItem(STORAGE_KEY);
      setState({ status: 'locked' });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const candidate = input.trim();
    if (candidate.length === 0) return;

    const valid = await verifyImageGeneratorKey(candidate);
    if (!valid) {
      setState({ status: 'locked', error: messages.imageGenerator.accessKeyError });
      return;
    }

    const stored: StoredAccess = { key: candidate, storedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setState({ status: 'unlocked' });
  };

  if (state.status === 'checking') return null;
  if (state.status === 'unlocked') return <>{children}</>;

  const errorId = 'image-generator-access-error';

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="image-generator-access-key" className="text-sm font-medium text-md-on-surface">
          {messages.imageGenerator.accessKeyLabel}
        </label>
        <input
          id="image-generator-access-key"
          type="password"
          autoComplete="off"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          aria-invalid={!!state.error}
          aria-describedby={state.error ? errorId : undefined}
          className="rounded-md border border-md-outline/40 bg-md-surface-container p-3 text-sm text-md-on-surface outline-none focus-visible:border-md-primary focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {state.error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" className="self-start">
        {messages.imageGenerator.unlock}
      </Button>
    </form>
  );
};
