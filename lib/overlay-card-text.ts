/**
 * Накладывает кириллический текст карточки поверх сгенерированной иллюстрации.
 * Модели (Gemini/Grok) ненадёжно рисуют кириллицу — текст рисуем в Canvas сами.
 */

const DEFAULT_COLOR = '#FF8C00';

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = words[0]!;
  for (let i = 1; i < words.length; i++) {
    const word = words[i]!;
    const trial = `${current} ${word}`;
    if (ctx.measureText(trial).width <= maxWidth) {
      current = trial;
    } else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Не удалось загрузить изображение для наложения текста.'));
    img.src = src;
  });
}

export interface OverlayCardTextOptions {
  /** HEX цвет текста (по умолчанию оранжевый карточек). */
  color?: string;
}

/**
 * Рисует `cardText` по центру поверх изображения (Arial bold, перенос строк).
 * Возвращает PNG Blob.
 */
export async function overlayCardTextOnImage(
  imageSrc: string,
  cardText: string,
  options: OverlayCardTextOptions = {},
): Promise<Blob> {
  const trimmed = cardText.trim();
  if (!trimmed) {
    const res = await fetch(imageSrc);
    return res.blob();
  }

  const img = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D недоступен.');

  ctx.drawImage(img, 0, 0);

  const color = options.color ?? DEFAULT_COLOR;
  const maxWidth = canvas.width * 0.86;
  let fontSize = Math.round(canvas.width * 0.048);
  const minFont = Math.round(canvas.width * 0.028);

  let lines: string[] = [];
  for (; fontSize >= minFont; fontSize -= 2) {
    ctx.font = `bold ${fontSize}px Arial, "Helvetica Neue", Helvetica, sans-serif`;
    lines = wrapText(ctx, trimmed, maxWidth);
    const blockHeight = lines.length * fontSize * 1.28;
    if (blockHeight <= canvas.height * 0.42) break;
  }

  ctx.font = `bold ${fontSize}px Arial, "Helvetica Neue", Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = Math.max(2, Math.round(fontSize * 0.08));
  ctx.lineJoin = 'round';

  const lineHeight = fontSize * 1.28;
  const blockHeight = lines.length * lineHeight;
  let y = canvas.height / 2 - blockHeight / 2 + lineHeight / 2;
  const x = canvas.width / 2;

  for (const line of lines) {
    ctx.strokeText(line, x, y);
    ctx.fillText(line, x, y);
    y += lineHeight;
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png');
  });
  if (!blob) throw new Error('Не удалось сохранить изображение с текстом.');
  return blob;
}
