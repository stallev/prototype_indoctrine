// Общий allowlist соотношений сторон для UI и POST /api/image-generator.
// В generateImage уходит значение из toProviderAspectRatio(): Grok Imagine
// принимает фиксированный набор (size не поддерживается). Печатный A6 альбом
// 148:105 (~1.41) в списке нет — маппится на ближайшее 4:3 (~1.33).

/** Соотношения Grok Imagine / @ai-sdk/xai. */
export const GROK_SUPPORTED_ASPECT_RATIOS = [
  '1:1',
  '16:9',
  '9:16',
  '4:3',
  '3:4',
  '3:2',
  '2:3',
  '2:1',
  '1:2',
  '19.5:9',
  '9:19.5',
  '20:9',
  '9:20',
  'auto',
] as const;

export type GrokAspectRatio = (typeof GROK_SUPPORTED_ASPECT_RATIOS)[number];

/** То, что реально уходит в generateImage (без `auto` — UI его не выбирает). */
export type ProviderAspectRatio = Exclude<GrokAspectRatio, 'auto'>;

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
 * Неподдерживаемые продуктовые соотношения маппятся на ближайшие из allowlist Grok.
 */
export function toProviderAspectRatio(value: ImageAspectRatio): ProviderAspectRatio {
  if (value === '148:105' || value === '5:4') return '4:3';
  if (value === '4:5') return '3:4';
  if (value === '21:9') return '20:9';
  if ((GROK_SUPPORTED_ASPECT_RATIOS as readonly string[]).includes(value)) {
    return value as ProviderAspectRatio;
  }
  return '4:3';
}

/** Длинная сторона канонического печатного холста (A6 @ 300 dpi ≈ 1748 px). */
const CANVAS_LONG_SIDE_PX = 1748;

/** A6 альбом 148×105 мм @ 300 dpi. */
const A6_LANDSCAPE_PX = { width: 1748, height: 1240 } as const;

/**
 * Размер холста оборота, когда лицевой картинки ещё нет.
 * Для `148:105` — A6 @ 300 dpi; иначе та же длинная сторона 1748.
 */
export function canvasSizeForAspectRatio(ratio: ImageAspectRatio): {
  width: number;
  height: number;
} {
  if (ratio === '148:105') {
    return { width: A6_LANDSCAPE_PX.width, height: A6_LANDSCAPE_PX.height };
  }
  const [widthPart, heightPart] = ratio.split(':').map(Number);
  if (!widthPart || !heightPart) {
    return { width: A6_LANDSCAPE_PX.width, height: A6_LANDSCAPE_PX.height };
  }
  if (widthPart >= heightPart) {
    return {
      width: CANVAS_LONG_SIDE_PX,
      height: Math.round((CANVAS_LONG_SIDE_PX * heightPart) / widthPart),
    };
  }
  return {
    width: Math.round((CANVAS_LONG_SIDE_PX * widthPart) / heightPart),
    height: CANVAS_LONG_SIDE_PX,
  };
}
