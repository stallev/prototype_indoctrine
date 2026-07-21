// Инлайн SVG-иллюстраций на этапе сборки. ТОЛЬКО сервер/сборка:
// импортирует node:fs, поэтому НЕ импортировать из клиентского кода.
//
// Схема хранения: путь лежит в question.svg_image (относительно public/),
// сам SVG читается с диска и встраивается в разметку на билде. Пока файл не
// сгенерирован (или svg_image === null) — возвращается нейтральный плейсхолдер.

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { questions } from './catechism';

export interface InlineOptions {
  /** Каталог public проекта. По умолчанию <cwd>/public. */
  baseDir?: string;
}

const defaultBaseDir = () => resolve(process.cwd(), 'public');

/**
 * Лёгкая санитизация перед вставкой SVG в HTML.
 * SVG, встроенный в страницу, исполняет <script> и обработчики событий —
 * это вектор XSS. Иллюстрации генерируются ИИ, т.е. полудоверенный источник,
 * поэтому вырезаем скрипты, обработчики on*, javascript: и внешние ссылки.
 * Это не полноценный санитайзер — для строгой защиты используйте DOMPurify.
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
 * Инлайн SVG для вопроса. Возвращает готовую к вставке строку SVG.
 * Если файл отсутствует или svg_image === null — плейсхолдер.
 */
export function inlineSvg(questionNumber: number, opts: InlineOptions = {}): string {
  const q = questions.find((x) => x.question_number === questionNumber);
  const rel = q?.svg_image ?? null;
  if (!rel) return placeholderSvg();

  const abs = join(opts.baseDir ?? defaultBaseDir(), rel);
  if (!existsSync(abs)) return placeholderSvg();

  return sanitizeSvg(readFileSync(abs, 'utf8'));
}

/** Проверка полноты набора: какие иллюстрации ещё не сгенерированы. */
export function missingIllustrations(opts: InlineOptions = {}): number[] {
  const baseDir = opts.baseDir ?? defaultBaseDir();
  return questions
    .filter((q) => {
      const rel = q.svg_image;
      return !rel || !existsSync(join(baseDir, rel));
    })
    .map((q) => q.question_number);
}
