'use client';

// Самостоятельный инструмент (image-generator-tool-spec.md §2) — не связан
// ссылками с навигацией по катехизису (drawer/`/topic/*`/`/q/*`) и не читает
// content/*.ts. Единственная клиентская страница инструмента: вся форма и
// состояние запроса живут здесь, см. hooks-and-state.md §1–2.

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { messages } from '@/lib/messages';

// Дискриминированное объединение вместо независимых булевых
// (isLoading/isError/data) — hooks-and-state.md §1.
type GenerationState =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; image: string }
  | { status: 'error'; message: string };

interface ApiResponse {
  image?: string;
  error?: string;
}

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<GenerationState>({ status: 'idle' });

  // Незавершённый запрос отменяется при повторной отправке формы и при уходе
  // со страницы (cleanup эффекта) — hooks-and-state.md §2.
  const abortControllerRef = useRef<AbortController | null>(null);
  // Object URL превью нужно освобождать при получении нового результата и
  // при размонтировании, иначе он "утекает" до перезагрузки страницы.
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Игнорировать повторную отправку, пока предыдущий запрос ожидает ответ —
    // логическая защита вместо HTML `disabled` на кнопке (кнопка не должна
    // "замирать" без обратной связи, hooks-and-state.md §2).
    if (state.status === 'pending') return;

    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length === 0) {
      // Клиентская валидация для очевидного случая (пустой промпт) — не
      // тратим round-trip на сервер, который вернёт ту же ошибку.
      setState({ status: 'error', message: messages.imageGenerator.emptyPromptError });
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState({ status: 'pending' });

    try {
      const response = await fetch('/api/image-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt }),
        signal: controller.signal,
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.image) {
        setState({ status: 'error', message: data.error ?? messages.imageGenerator.genericError });
        return;
      }

      // Контракт (image-generator-api-contract.md §5): ответ конвертируется
      // на клиенте в Blob перед скачиванием. `fetch()` на data: URL — это
      // локальное декодирование base64 в памяти, не сетевой запрос.
      const blob = await fetch(data.image).then((r) => r.blob());
      const objectUrl = URL.createObjectURL(blob);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = objectUrl;

      setState({ status: 'success', image: objectUrl });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setState({ status: 'error', message: messages.imageGenerator.genericError });
    }
  };

  const isPending = state.status === 'pending';
  const hasError = state.status === 'error';
  const errorMessageId = 'image-prompt-error';

  return (
    <main className="mx-auto max-w-2xl p-4 md:max-w-3xl md:p-8">
      <h1 className="text-xl font-semibold text-md-on-surface md:text-2xl">{messages.imageGenerator.heading}</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="image-prompt" className="text-sm font-medium text-md-on-surface">
            {messages.imageGenerator.promptLabel}
          </label>
          <textarea
            id="image-prompt"
            name="prompt"
            rows={4}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={messages.imageGenerator.promptPlaceholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorMessageId : undefined}
            className="rounded-md border border-md-outline/40 bg-md-surface-container p-3 text-sm text-md-on-surface outline-none focus-visible:border-md-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        {hasError && (
          <p id={errorMessageId} role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        )}

        {/* Кнопка остаётся кликабельной во время pending (не `disabled`) —
            повторный клик игнорируется логикой обработчика выше, обратная
            связь даётся текстом/спиннером, не "замиранием" контрола. */}
        <Button type="submit" className="self-start">
          {isPending ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              {messages.imageGenerator.pending}
            </>
          ) : (
            messages.imageGenerator.submit
          )}
        </Button>
      </form>

      {state.status === 'success' && (
        <div className="mt-6 flex flex-col items-start gap-3">
          {/* Blob-объект существует только в этой вкладке — next/image
              (удалённый оптимизатор) для него не подходит, обычный <img>. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.image}
            alt={messages.imageGenerator.previewAlt}
            className="max-w-full rounded-md border border-md-outline/20"
          />
          <Button asChild>
            <a href={state.image} download={messages.imageGenerator.downloadFileName}>
              {messages.imageGenerator.download}
            </a>
          </Button>
        </div>
      )}
    </main>
  );
}
