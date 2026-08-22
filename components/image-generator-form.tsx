'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ImageGeneratorCardBackPreview } from '@/components/image-generator-card-back-preview';
import { ImageGeneratorResultPreviews } from '@/components/image-generator-result-previews';
import {
  questionCardFileName,
  type CardBackContent,
} from '@/lib/card-back';
import {
  DEFAULT_IMAGE_ASPECT_RATIO,
  IMAGE_ASPECT_RATIOS,
  IMAGE_ASPECT_RATIO_STORAGE_KEY,
  canvasSizeForAspectRatio,
  isImageAspectRatio,
  type ImageAspectRatio,
} from '@/lib/image-generator-aspect-ratios';
import { GROK_IMAGINE_IMAGE_USD } from '@/lib/image-generator-pricing';
import {
  DEFAULT_OVERLAY_TEXT_COLOR,
  OVERLAY_TEXT_COLORS,
  OVERLAY_TEXT_COLOR_STORAGE_KEY,
  isOverlayTextColor,
  overlayCardTextOnImage,
  type OverlayTextColor,
} from '@/lib/overlay-card-text';
import { messages } from '@/lib/messages';
import { GROK_CARD_PROMPTS, getGrokCardPrompt } from '@/prompts/grok-card-prompts-data';

// Дискриминированное объединение вместо независимых булевых
// (isLoading/isError/data) — hooks-and-state.md §1.
type GenerationState =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; image: string; estimatedCostUsd: number }
  | { status: 'error'; message: string };

interface ApiResponse {
  image?: string;
  estimatedCostUsd?: number;
  error?: string;
}

const ACCESS_KEY_STORAGE_KEY = 'image-generator-access-key';

/** Тот же ключ, что уже проверен `ImageGeneratorAccessGate` при открытии страницы — второй источник истины не заводится. */
function readAccessKey(): string | null {
  try {
    const raw = localStorage.getItem(ACCESS_KEY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { key?: string };
    return typeof parsed.key === 'string' ? parsed.key : null;
  } catch {
    return null;
  }
}

function readStoredAspectRatio(): ImageAspectRatio {
  try {
    const raw = localStorage.getItem(IMAGE_ASPECT_RATIO_STORAGE_KEY);
    if (isImageAspectRatio(raw)) return raw;
  } catch {
    // ignore — fallback ниже
  }
  return DEFAULT_IMAGE_ASPECT_RATIO;
}

function persistAspectRatio(value: ImageAspectRatio): void {
  try {
    localStorage.setItem(IMAGE_ASPECT_RATIO_STORAGE_KEY, value);
  } catch {
    // Квота / приватный режим — выбор всё равно работает в сессии.
  }
}

function readStoredOverlayTextColor(): OverlayTextColor {
  try {
    const raw = localStorage.getItem(OVERLAY_TEXT_COLOR_STORAGE_KEY);
    if (isOverlayTextColor(raw)) return raw;
  } catch {
    // ignore — fallback ниже
  }
  return DEFAULT_OVERLAY_TEXT_COLOR;
}

function persistOverlayTextColor(value: OverlayTextColor): void {
  try {
    localStorage.setItem(OVERLAY_TEXT_COLOR_STORAGE_KEY, value);
  } catch {
    // Квота / приватный режим — выбор всё равно работает в сессии.
  }
}

function readImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Не удалось прочитать размер изображения.'));
    img.src = src;
  });
}

interface ImageGeneratorFormProps {
  backCards: Record<string, CardBackContent>;
}

/** Форма промпта + результат — рендерится только после разблокировки `ImageGeneratorAccessGate`. */
export const ImageGeneratorForm = ({ backCards }: ImageGeneratorFormProps) => {
  const [prompt, setPrompt] = useState('');
  // Дефолт 148:105; после mount подтягиваем сохранённый выбор из localStorage
  // (избегаем SSR/hydration mismatch при чтении storage в инициализаторе).
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(DEFAULT_IMAGE_ASPECT_RATIO);
  const [overlayTextColor, setOverlayTextColor] = useState<OverlayTextColor>(
    DEFAULT_OVERLAY_TEXT_COLOR,
  );
  /** Номер вопроса катехизиса или '' (ручной промпт). */
  const [selectedQuestion, setSelectedQuestion] = useState('');
  /**
   * Кириллическая подпись для Canvas-наложения после генерации.
   * Заполняется при выборе вопроса; модели кириллицу не доверяем.
   */
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const [addQuestionText, setAddQuestionText] = useState(true);
  const [createCardBack, setCreateCardBack] = useState(false);
  const [frontSize, setFrontSize] = useState<{ width: number; height: number } | null>(null);
  const [state, setState] = useState<GenerationState>({ status: 'idle' });

  // Незавершённый запрос отменяется при повторной отправке формы и при уходе
  // со страницы (cleanup эффекта) — hooks-and-state.md §2.
  const abortControllerRef = useRef<AbortController | null>(null);
  // Object URL превью нужно освобождать при получении нового результата и
  // при размонтировании, иначе он "утекает" до перезагрузки страницы.
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const storedRatio = readStoredAspectRatio();
    const storedColor = readStoredOverlayTextColor();
    // localStorage недоступен на SSR — читаем после mount, иначе hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect -- синхронизация с localStorage после гидрации */
    setAspectRatio(storedRatio);
    persistAspectRatio(storedRatio);
    setOverlayTextColor(storedColor);
    persistOverlayTextColor(storedColor);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const selectedQuestionNumber = selectedQuestion === '' ? null : Number(selectedQuestion);
  const hasQuestion =
    selectedQuestionNumber !== null && Number.isFinite(selectedQuestionNumber);
  const backContent = hasQuestion ? (backCards[String(selectedQuestionNumber)] ?? null) : null;
  const canonicalSize = canvasSizeForAspectRatio(aspectRatio);
  const backWidth =
    state.status === 'success' && frontSize ? frontSize.width : canonicalSize.width;
  const backHeight =
    state.status === 'success' && frontSize ? frontSize.height : canonicalSize.height;

  const handleAspectRatioChange = (value: string) => {
    if (!isImageAspectRatio(value)) return;
    setAspectRatio(value);
    persistAspectRatio(value);
  };

  const handleOverlayTextColorChange = (value: string) => {
    if (!isOverlayTextColor(value)) return;
    setOverlayTextColor(value);
    persistOverlayTextColor(value);
  };

  const handleQuestionPromptChange = (value: string) => {
    setSelectedQuestion(value);
    if (value === '') {
      setOverlayText(null);
      return;
    }
    const n = Number(value);
    const entry = getGrokCardPrompt(n);
    if (!entry) return;
    // В API — только сцена без просьбы рисовать буквы; подпись — через Canvas.
    setPrompt(entry.scenePrompt);
    setOverlayText(entry.cardText);
  };

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
      const accessKey = readAccessKey();
      const response = await fetch('/api/image-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Сервер повторно проверяет тот же SECURITY_IMAGE_GENERATOR_KEY —
          // gate на странице не даёт защиты сам по себе, если этот роут
          // можно вызвать напрямую в обход UI (image-generator-tool-spec.md §6).
          ...(accessKey ? { 'x-image-generator-key': accessKey } : {}),
        },
        body: JSON.stringify({ prompt: trimmedPrompt, aspectRatio }),
        signal: controller.signal,
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.image) {
        setState({ status: 'error', message: data.error ?? messages.imageGenerator.genericError });
        return;
      }

      // Контракт (image-generator-api-contract.md §5): ответ конвертируется
      // на клиенте в Blob. Кириллицу модель рисует плохо — при выборе вопроса
      // накладываем cardText через Canvas (lib/overlay-card-text.ts).
      const rawBlob = await fetch(data.image).then((r) => r.blob());
      const rawUrl = URL.createObjectURL(rawBlob);
      let finalUrl = rawUrl;
      try {
        if (overlayText && addQuestionText) {
          const withText = await overlayCardTextOnImage(rawUrl, overlayText, {
            color: overlayTextColor,
          });
          URL.revokeObjectURL(rawUrl);
          finalUrl = URL.createObjectURL(withText);
        }
      } catch {
        URL.revokeObjectURL(rawUrl);
        setState({ status: 'error', message: messages.imageGenerator.genericError });
        return;
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = finalUrl;

      try {
        setFrontSize(await readImageSize(finalUrl));
      } catch {
        setFrontSize(null);
      }

      setState({
        status: 'success',
        image: finalUrl,
        estimatedCostUsd:
          typeof data.estimatedCostUsd === 'number'
            ? data.estimatedCostUsd
            : GROK_IMAGINE_IMAGE_USD,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setState({ status: 'error', message: messages.imageGenerator.genericError });
    }
  };

  const isPending = state.status === 'pending';
  const hasError = state.status === 'error';
  const errorMessageId = 'image-prompt-error';
  const frontUrl = state.status === 'success' ? state.image : null;
  const frontCostUsd = state.status === 'success' ? state.estimatedCostUsd : null;
  const frontDownloadName =
    hasQuestion && selectedQuestionNumber !== null
      ? questionCardFileName(selectedQuestionNumber, 'front')
      : messages.imageGenerator.downloadFileName;
  const showCardBack = createCardBack && backContent !== null;
  const frontDownloadLabel = showCardBack
    ? messages.imageGenerator.downloadFront
    : messages.imageGenerator.download;
  const backDownloadName =
    selectedQuestionNumber !== null
      ? questionCardFileName(selectedQuestionNumber, 'back')
      : 'card-back.png';

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="image-question-prompt" className="text-sm font-medium text-md-on-surface">
            {messages.imageGenerator.questionPromptLabel}
          </label>
          <select
            id="image-question-prompt"
            name="questionPrompt"
            value={selectedQuestion}
            onChange={(event) => handleQuestionPromptChange(event.target.value)}
            className="rounded-md border border-md-outline/40 bg-md-surface-container p-3 text-sm text-md-on-surface outline-none focus-visible:border-md-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">{messages.imageGenerator.questionPromptPlaceholder}</option>
            {GROK_CARD_PROMPTS.map((option) => (
              <option key={option.questionNumber} value={String(option.questionNumber)}>
                {option.label}
              </option>
            ))}
          </select>
          <label
            htmlFor="image-overlay-question-text"
            className="flex items-center gap-2 text-sm text-md-on-surface"
          >
            <input
              id="image-overlay-question-text"
              name="addQuestionText"
              type="checkbox"
              checked={addQuestionText}
              onChange={(event) => setAddQuestionText(event.target.checked)}
              className="size-4 accent-md-primary"
            />
            {messages.imageGenerator.overlayQuestionTextLabel}
          </label>
          {addQuestionText ? (
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-md-on-surface">
                {messages.imageGenerator.overlayTextColorLabel}
              </legend>
              <div className="flex flex-wrap gap-2">
                {OVERLAY_TEXT_COLORS.map((option) => {
                  const selected = overlayTextColor === option.value;
                  return (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="overlayTextColor"
                        value={option.value}
                        checked={selected}
                        onChange={(event) => handleOverlayTextColorChange(event.target.value)}
                        className="peer sr-only"
                      />
                      <span
                        title={option.label}
                        aria-hidden="true"
                        className={`block size-8 rounded-full border border-md-outline/40 peer-focus-visible:ring-2 peer-focus-visible:ring-md-primary ${
                          selected ? 'ring-2 ring-md-primary ring-offset-2 ring-offset-md-surface' : ''
                        }`}
                        style={{ backgroundColor: option.value }}
                      />
                      <span className="sr-only">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : null}
          {overlayText && addQuestionText ? (
            <p className="text-xs text-md-outline">{messages.imageGenerator.overlayTextHint}</p>
          ) : null}
          <label
            htmlFor="image-create-card-back"
            className={`flex items-center gap-2 text-sm ${
              hasQuestion ? 'text-md-on-surface' : 'text-md-outline'
            }`}
          >
            <input
              id="image-create-card-back"
              name="createCardBack"
              type="checkbox"
              checked={createCardBack}
              disabled={!hasQuestion}
              aria-describedby={!hasQuestion ? 'image-create-card-back-hint' : undefined}
              onChange={(event) => setCreateCardBack(event.target.checked)}
              className="size-4 accent-md-primary disabled:opacity-50"
            />
            {messages.imageGenerator.createCardBackLabel}
          </label>
          {!hasQuestion ? (
            <p id="image-create-card-back-hint" className="text-xs text-md-outline">
              {messages.imageGenerator.createCardBackHint}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="image-prompt" className="text-sm font-medium text-md-on-surface">
            {messages.imageGenerator.promptLabel}
          </label>
          <textarea
            id="image-prompt"
            name="prompt"
            rows={10}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={messages.imageGenerator.promptPlaceholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorMessageId : undefined}
            className="rounded-md border border-md-outline/40 bg-md-surface-container p-3 text-sm text-md-on-surface outline-none focus-visible:border-md-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="image-aspect-ratio" className="text-sm font-medium text-md-on-surface">
            {messages.imageGenerator.aspectRatioLabel}
          </label>
          <select
            id="image-aspect-ratio"
            name="aspectRatio"
            value={aspectRatio}
            onChange={(event) => handleAspectRatioChange(event.target.value)}
            className="rounded-md border border-md-outline/40 bg-md-surface-container p-3 text-sm text-md-on-surface outline-none focus-visible:border-md-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {IMAGE_ASPECT_RATIOS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

      <ImageGeneratorResultPreviews
        frontUrl={frontUrl}
        frontCostUsd={frontCostUsd}
        frontDownloadName={frontDownloadName}
        frontDownloadLabel={frontDownloadLabel}
      >
        {showCardBack && backContent ? (
          <ImageGeneratorCardBackPreview
            content={backContent}
            width={backWidth}
            height={backHeight}
            downloadName={backDownloadName}
          />
        ) : null}
      </ImageGeneratorResultPreviews>
    </>
  );
};
