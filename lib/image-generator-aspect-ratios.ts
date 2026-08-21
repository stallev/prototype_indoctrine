// Общий allowlist соотношений сторон для UI и POST /api/image-generator.
// В generateImage уходит значение из toProviderAspectRatio(): Gemini 2.5 Flash
// Image принимает только документированный набор (1:1, 2:3, 3:2, 3:4, 4:3,
// 4:5, 5:4, 9:16, 16:9, 21:9). Печатный A6 альбом 148:105 (~1.41) в списке
// нет — маппится на ближайшее поддерживаемое 4:3 (~1.33).

/** Соотношения, которые принимает Gemini Image / @ai-sdk/google. */
export const GEMINI_SUPPORTED_ASPECT_RATIOS = [
  '1:1',
  '2:3',
  '3:2',
  '3:4',
  '4:3',
  '4:5',
  '5:4',
  '9:16',
  '16:9',
  '21:9',
] as const;

export type GeminiAspectRatio = (typeof GEMINI_SUPPORTED_ASPECT_RATIOS)[number];

export const IMAGE_ASPECT_RATIOS = [
  { value: '148:105', label: '148:105 (A6 альбом)' },
  { value: '3:2', label: '3:2' },
  { value: '4:3', label: '4:3' },
  { value: '16:9', label: '16:9' },
  { value: '1:1', label: '1:1' },
  { value: '5:4', label: '5:4' },
  { value: '4:5', label: '4:5' },
  { value: '3:4', label: '3:4' },
  { value: '2:3', label: '2:3' },
  { value: '9:16', label: '9:16' },
  { value: '21:9', label: '21:9' },
] as const;

export type ImageAspectRatio = (typeof IMAGE_ASPECT_RATIOS)[number]['value'];

export const DEFAULT_IMAGE_ASPECT_RATIO: ImageAspectRatio = '148:105';

export const IMAGE_ASPECT_RATIO_STORAGE_KEY = 'image-generator-aspect-ratio';

const aspectRatioValues = IMAGE_ASPECT_RATIOS.map((r) => r.value) as [
  ImageAspectRatio,
  ...ImageAspectRatio[],
];

/** Значения для zod.enum / валидации тела запроса (UI/продуктовые). */
export const IMAGE_ASPECT_RATIO_VALUES = aspectRatioValues;

export function isImageAspectRatio(value: unknown): value is ImageAspectRatio {
  return typeof value === 'string' && (aspectRatioValues as string[]).includes(value);
}

/**
 * UI-значение → то, что реально уходит в generateImage({ aspectRatio }).
 * 148:105 не поддерживается провайдером → 4:3 (ближайшее из allowlist Gemini).
 */
export function toProviderAspectRatio(value: ImageAspectRatio): GeminiAspectRatio {
  if (value === '148:105') return '4:3';
  if ((GEMINI_SUPPORTED_ASPECT_RATIOS as readonly string[]).includes(value)) {
    return value as GeminiAspectRatio;
  }
  return '4:3';
}
