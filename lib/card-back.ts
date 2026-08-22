import { wrapText } from '@/lib/canvas-text';

export type CardBackVerse = {
  reference: string;
  text: string | null;
};

export type CardBackContent = {
  answer: string;
  verse: CardBackVerse | null;
};

const FRAME_COLOR = '#3d5a80';
const ANSWER_COLOR = '#1C1917';
const SCRIPTURE_COLOR = '#3d5a80';
const MIN_FONT_PX = 8;
const SHRINK_STEP = 0.97;

export function questionCardFileName(
  questionNumber: number,
  side: 'front' | 'back',
): string {
  return `q${String(questionNumber).padStart(3, '0')}-${side}.png`;
}

function canvasFontFamily(): string {
  if (typeof document === 'undefined') return 'Roboto, Arial, sans-serif';
  const fromBody = getComputedStyle(document.body).fontFamily.trim();
  return fromBody.length > 0 ? fromBody : 'Roboto, Arial, sans-serif';
}

function drawFrame(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const short = Math.min(width, height);
  const outerInset = short * 0.035;
  const innerInset = short * 0.055;
  const stroke = Math.max(2, Math.round(short * 0.004));
  const cornerLen = short * 0.038;
  const cornerInset = (outerInset + innerInset) / 2;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = FRAME_COLOR;
  ctx.lineWidth = stroke;
  ctx.strokeRect(outerInset, outerInset, width - 2 * outerInset, height - 2 * outerInset);
  ctx.strokeRect(innerInset, innerInset, width - 2 * innerInset, height - 2 * innerInset);

  ctx.lineWidth = Math.max(1, Math.round(stroke * 0.65));
  ctx.lineCap = 'square';
  const corners: Array<{ x: number; y: number; dx: number; dy: number }> = [
    { x: cornerInset, y: cornerInset, dx: 1, dy: 1 },
    { x: width - cornerInset, y: cornerInset, dx: -1, dy: 1 },
    { x: cornerInset, y: height - cornerInset, dx: 1, dy: -1 },
    { x: width - cornerInset, y: height - cornerInset, dx: -1, dy: -1 },
  ];
  for (const corner of corners) {
    ctx.beginPath();
    ctx.moveTo(corner.x + corner.dx * cornerLen, corner.y);
    ctx.lineTo(corner.x, corner.y);
    ctx.lineTo(corner.x, corner.y + corner.dy * cornerLen);
    ctx.stroke();
  }
}

function anyLineOverflows(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxWidth: number,
): boolean {
  return lines.some((line) => ctx.measureText(line).width > maxWidth);
}

interface LaidOutBack {
  answerLines: string[];
  quoteLines: string[];
  referenceLines: string[];
  answerSize: number;
  scriptureSize: number;
  referenceSize: number;
  answerLineHeight: number;
  scriptureLineHeight: number;
  referenceLineHeight: number;
  gapAfterAnswer: number;
  gapAfterQuote: number;
  blockHeight: number;
  fits: boolean;
}

function layoutCardBack(
  ctx: CanvasRenderingContext2D,
  content: CardBackContent,
  innerWidth: number,
  innerHeight: number,
  answerSize: number,
  fontFamily: string,
): LaidOutBack {
  const scriptureSize = answerSize * 0.58;
  const referenceSize = scriptureSize * 0.85;
  const answerLineHeight = answerSize * 1.28;
  const scriptureLineHeight = scriptureSize * 1.35;
  const referenceLineHeight = referenceSize * 1.35;
  const gapAfterAnswer = content.verse ? answerSize * 0.6 : 0;

  ctx.font = `700 ${answerSize}px ${fontFamily}`;
  const answerLines = wrapText(ctx, content.answer.trim(), innerWidth);
  let overflows = anyLineOverflows(ctx, answerLines, innerWidth);

  const quoteLines: string[] = [];
  if (content.verse?.text) {
    ctx.font = `italic 400 ${scriptureSize}px ${fontFamily}`;
    quoteLines.push(...wrapText(ctx, `«${content.verse.text}»`, innerWidth));
    overflows = overflows || anyLineOverflows(ctx, quoteLines, innerWidth);
  }

  const referenceLines: string[] = [];
  if (content.verse) {
    ctx.font = `400 ${referenceSize}px ${fontFamily}`;
    referenceLines.push(...wrapText(ctx, content.verse.reference, innerWidth));
    overflows = overflows || anyLineOverflows(ctx, referenceLines, innerWidth);
  }

  const gapAfterQuote = quoteLines.length > 0 && referenceLines.length > 0 ? scriptureSize * 0.25 : 0;
  const blockHeight =
    answerLines.length * answerLineHeight +
    gapAfterAnswer +
    quoteLines.length * scriptureLineHeight +
    gapAfterQuote +
    referenceLines.length * referenceLineHeight;

  return {
    answerLines,
    quoteLines,
    referenceLines,
    answerSize,
    scriptureSize,
    referenceSize,
    answerLineHeight,
    scriptureLineHeight,
    referenceLineHeight,
    gapAfterAnswer,
    gapAfterQuote,
    blockHeight,
    fits: !overflows && blockHeight <= innerHeight,
  };
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  startY: number,
  lineHeight: number,
): number {
  let y = startY;
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

export interface RenderCardBackOptions {
  content: CardBackContent;
  width: number;
  height: number;
}

/** Белый оборот с рамкой, ответом и первым стихом. PNG Blob. */
export async function renderCardBack(options: RenderCardBackOptions): Promise<Blob> {
  const { content, width, height } = options;
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D недоступен.');

  const fontFamily = canvasFontFamily();
  try {
    await document.fonts.load(`700 64px ${fontFamily}`);
    await document.fonts.load(`italic 400 40px ${fontFamily}`);
  } catch {
    // Запасной Arial в стеке computed font-family.
  }

  drawFrame(ctx, width, height);

  const short = Math.min(width, height);
  const frameInner = short * 0.055;
  // Горизонтальные поля — доля ширины, иначе на альбоме текст липнет к рамке.
  const padX = Math.max(width * 0.125, frameInner + short * 0.055);
  const padY = Math.max(height * 0.1, frameInner + short * 0.04);
  const innerX = padX;
  const innerY = padY;
  const innerWidth = width - 2 * padX;
  const innerHeight = height - 2 * padY;

  // Стартуем крупно и сжимаем, пока блок не влезет: так кегль максимальный,
  // ответ и цитата переносятся, вертикальные поля уменьшаются.
  let answerSize = innerHeight * 0.2;
  let laid = layoutCardBack(ctx, content, innerWidth, innerHeight, answerSize, fontFamily);
  while (!laid.fits && answerSize > MIN_FONT_PX) {
    answerSize = Math.max(MIN_FONT_PX, answerSize * SHRINK_STEP);
    laid = layoutCardBack(ctx, content, innerWidth, innerHeight, answerSize, fontFamily);
    if (answerSize <= MIN_FONT_PX) break;
  }

  const centerX = innerX + innerWidth / 2;
  let y = innerY + (innerHeight - laid.blockHeight) / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.fillStyle = ANSWER_COLOR;
  ctx.font = `700 ${laid.answerSize}px ${fontFamily}`;
  y = drawLines(ctx, laid.answerLines, centerX, y, laid.answerLineHeight);

  y += laid.gapAfterAnswer;

  if (laid.quoteLines.length > 0) {
    ctx.fillStyle = SCRIPTURE_COLOR;
    ctx.font = `italic 400 ${laid.scriptureSize}px ${fontFamily}`;
    y = drawLines(ctx, laid.quoteLines, centerX, y, laid.scriptureLineHeight);
    y += laid.gapAfterQuote;
  }

  if (laid.referenceLines.length > 0) {
    ctx.fillStyle = SCRIPTURE_COLOR;
    ctx.font = `400 ${laid.referenceSize}px ${fontFamily}`;
    drawLines(ctx, laid.referenceLines, centerX, y, laid.referenceLineHeight);
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png');
  });
  if (!blob) throw new Error('Не удалось сохранить оборот карточки.');
  return blob;
}
