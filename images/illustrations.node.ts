// Разрешение иллюстраций на этапе сборки. ТОЛЬКО сервер/сборка:
// импортирует node:fs, поэтому НЕ импортировать из клиентского кода.
//
// Схема: путь в question.illustration (относительно public/).
//   .svg  → читается с диска и инлайнится в разметку
//   .png / .jpg / .jpeg / .webp → отдаётся как публичный URL для <img>
// Пока файла нет или illustration === null — нейтральный SVG-плейсхолдер.

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  illustrationKind,
  illustrationPublicUrl,
  questions,
  type IllustrationKind,
} from '../utils/catechism';

export interface InlineOptions {
  /** Каталог public проекта. По умолчанию <cwd>/public. */
  baseDir?: string;
}

const defaultBaseDir = () => resolve(process.cwd(), 'public');

export type ResolvedIllustration =
  | { kind: 'svg'; markup: string }
  | { kind: 'raster'; src: string; path: string }
  | { kind: 'placeholder'; markup: string };

/**
 * Лёгкая санитизация перед вставкой SVG в HTML.
 * SVG, встроенный в страницу, исполняет <script> и обработчики событий —
 * это вектор XSS. Иллюстрации генерируются ИИ, т.е. полудоверенный источник,
 * поэтому вырезаем скрипты, обработчики on*, javascript: и foreignObject.
 * Это не полноценный санитайзер — для строгой защиты используйте DOMPurify.
 * Для растра (png/jpg) санитизация не нужна: файл отдаётся как статикой.
 */
export function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/(href|xlink:href)\s*=\s*"\s*javascript:[^"]*"/gi, '')
    .trim();
}

/** Нейтральный плейсхолдер в едином viewBox (для несгенерированных карточек). */
export function placeholderSvg(): string {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" ' +
    'preserveAspectRatio="xMidYMid meet" role="img" aria-label="Иллюстрация">' +
    '<rect width="1200" height="900" fill="#BFE3F0"/>' +
    '<circle cx="600" cy="450" r="120" fill="#FFFFFF" opacity="0.6"/>' +
    '</svg>'
  );
}

/**
 * Единая точка разрешения иллюстрации по номеру вопроса.
 * Рендер: kind === 'svg' | 'placeholder' → dangerouslySetInnerHTML / set:html;
 *         kind === 'raster' → <img src={src} alt="…" />.
 */
export function resolveIllustration(
  questionNumber: number,
  opts: InlineOptions = {},
): ResolvedIllustration {
  const q = questions.find((x) => x.question_number === questionNumber);
  const rel = q?.illustration ?? null;
  if (!rel) return { kind: 'placeholder', markup: placeholderSvg() };

  const abs = join(opts.baseDir ?? defaultBaseDir(), rel);
  if (!existsSync(abs)) return { kind: 'placeholder', markup: placeholderSvg() };

  const kind: IllustrationKind | null = illustrationKind(rel);
  if (kind === 'raster') {
    return { kind: 'raster', src: illustrationPublicUrl(rel), path: rel };
  }
  if (kind === 'svg') {
    return { kind: 'svg', markup: sanitizeSvg(readFileSync(abs, 'utf8')) };
  }

  // Неизвестное расширение в JSON не должно пройти Zod; на всякий случай.
  return { kind: 'placeholder', markup: placeholderSvg() };
}

/**
 * Инлайн только для SVG. Для растра / отсутствия файла — плейсхолдер.
 * Предпочтительно использовать resolveIllustration и ветвить рендер.
 */
export function inlineSvg(questionNumber: number, opts: InlineOptions = {}): string {
  const resolved = resolveIllustration(questionNumber, opts);
  if (resolved.kind === 'svg' || resolved.kind === 'placeholder') {
    return resolved.markup;
  }
  return placeholderSvg();
}

/** Проверка полноты набора: какие иллюстрации ещё не готовы (нет пути или файла). */
export function missingIllustrations(opts: InlineOptions = {}): number[] {
  const baseDir = opts.baseDir ?? defaultBaseDir();
  return questions
    .filter((q) => {
      const rel = q.illustration;
      return !rel || !existsSync(join(baseDir, rel));
    })
    .map((q) => q.question_number);
}
