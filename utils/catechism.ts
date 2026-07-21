// Схема, типы и загрузчик данных катехизиса.
//
// Источник данных — catechism.json (единый source of truth).
// Библейские цитаты — Синодальный перевод (как в исходном PDF).
//
// Модель нормализована:
//   topics           — разделы катехизиса
//   questions        — вопросы/ответы (answer = текст ответа как в книге)
//   verses           — УНИКАЛЬНЫЕ библейские стихи (дедупликация по ссылке).
//                      text === null, когда в книге дана только ссылка без цитаты.
//   questionVerses   — связь M:N вопрос↔стих с порядком цитирования (position).
//
// Один стих может цитироваться несколькими вопросами (напр. Евангелие от
// Иоанна 3:16 — вопросы 43 и 93), поэтому стихи вынесены в отдельный массив,
// а не продублированы внутри каждого вопроса.

import { z } from 'zod';
import raw from '../data/catechism.json';

// --- Схемы ---

/** Допустимые расширения иллюстраций (путь относительно public/). */
export const ILLUSTRATION_EXTENSIONS = ['svg', 'png', 'jpg', 'jpeg', 'webp'] as const;
export type IllustrationExtension = (typeof ILLUSTRATION_EXTENSIONS)[number];

const illustrationPathSchema = z
  .string()
  .regex(
    /^illustrations\/q\d{3}\.(svg|png|jpe?g|webp)$/i,
    'Ожидается путь вида illustrations/q001.svg|png|jpg|jpeg|webp',
  );

export const TopicSchema = z.object({
  topic_id: z.number().int().positive(),
  topic_name: z.string().min(1),
});

export const QuestionSchema = z.object({
  id: z.number().int().positive(),
  question_number: z.number().int().positive(),
  question_content: z.string().min(1),
  answer: z.string().min(1),
  topic_id: z.number().int().positive(),
  // Путь к иллюстрации относительно public/ (svg | png | jpg | jpeg | webp).
  // null — путь ещё не задан. Рендер: SVG инлайнится, растр — через <img src>.
  illustration: illustrationPathSchema.nullable(),
});

export const VerseSchema = z.object({
  id: z.number().int().positive(),
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  verses: z.string().min(1), // диапазон стихов, напр. "27" или "27-28"
  reference: z.string().min(1), // отображаемая ссылка, напр. "Псалом 101:27-28"
  text: z.string().min(1).nullable(), // Синодальный текст, либо null (только ссылка)
});

export const QuestionVerseSchema = z.object({
  question_id: z.number().int().positive(),
  verse_id: z.number().int().positive(),
  position: z.number().int().positive(), // порядок цитаты внутри вопроса
});

export const CatechismSchema = z
  .object({
    topics: z.array(TopicSchema),
    questions: z.array(QuestionSchema),
    verses: z.array(VerseSchema),
    question_verses: z.array(QuestionVerseSchema),
  })
  .superRefine((data, ctx) => {
    const topicIds = new Set(data.topics.map((t) => t.topic_id));
    const questionNumbers = new Set(data.questions.map((q) => q.question_number));
    const verseIds = new Set(data.verses.map((v) => v.id));

    for (const q of data.questions) {
      if (!topicIds.has(q.topic_id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Вопрос ${q.id} ссылается на несуществующий topic_id ${q.topic_id}`,
        });
      }
    }
    for (const link of data.question_verses) {
      if (!questionNumbers.has(link.question_id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Связь ссылается на несуществующий question_id ${link.question_id}`,
        });
      }
      if (!verseIds.has(link.verse_id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Связь ссылается на несуществующий verse_id ${link.verse_id}`,
        });
      }
    }
  });

// --- Типы (выводятся из схем) ---

export type Topic = z.infer<typeof TopicSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Verse = z.infer<typeof VerseSchema>;
export type QuestionVerse = z.infer<typeof QuestionVerseSchema>;
export type Catechism = z.infer<typeof CatechismSchema>;

// --- Валидированные данные ---
// Валидация выполняется один раз при импорте модуля (на билде для статики —
// стоимость нулевая, но защищает от битого JSON после ручных правок).

export const catechism: Catechism = CatechismSchema.parse(raw);

export const topics = catechism.topics;
export const questions = catechism.questions;
export const verses = catechism.verses;
export const questionVerses = catechism.question_verses;

// --- Хелперы для рендеринга ---

const verseById = new Map<number, Verse>(verses.map((v) => [v.id, v]));

/** Стихи для вопроса, в порядке цитирования. */
export function versesForQuestion(questionNumber: number): Verse[] {
  return questionVerses
    .filter((l) => l.question_id === questionNumber)
    .sort((a, b) => a.position - b.position)
    .map((l) => verseById.get(l.verse_id))
    .filter((v): v is Verse => v !== undefined);
}

/** Вопросы раздела, отсортированные по номеру. */
export function questionsForTopic(topicId: number): Question[] {
  return questions
    .filter((q) => q.topic_id === topicId)
    .sort((a, b) => a.question_number - b.question_number);
}

// --- Иллюстрации ---
// Хранение: путь в поле illustration, файлы в public/illustrations/.
// SVG — инлайн на сборке; png/jpg/jpeg/webp — URL для <img>.
// Чтение с диска — в images/illustrations.node.ts (только сервер/сборка).

/** Каталог иллюстраций относительно public/. */
export const ILLUSTRATION_DIR = 'illustrations';

/** @deprecated Используйте ILLUSTRATION_DIR. */
export const SVG_DIR = ILLUSTRATION_DIR;

export type IllustrationKind = 'svg' | 'raster';

/** Расширение из пути (без точки), в нижнем регистре; иначе null. */
export function illustrationExt(path: string): IllustrationExtension | null {
  const m = path.match(/\.([a-z0-9]+)$/i);
  if (!m) return null;
  const ext = m[1].toLowerCase();
  if (ext === 'jpeg') return 'jpg';
  if ((ILLUSTRATION_EXTENSIONS as readonly string[]).includes(ext)) {
    return ext as IllustrationExtension;
  }
  return null;
}

/** svg → инлайн; png/jpg/webp → растр для <img>. */
export function illustrationKind(path: string): IllustrationKind | null {
  const ext = illustrationExt(path);
  if (!ext) return null;
  return ext === 'svg' ? 'svg' : 'raster';
}

/** Стем имени без расширения: q001. */
export function illustrationStem(questionNumber: number): string {
  return `q${String(questionNumber).padStart(3, '0')}`;
}

/** Имя файла с заданным расширением (по умолчанию svg). */
export function illustrationFileName(
  questionNumber: number,
  ext: IllustrationExtension = 'svg',
): string {
  const e = ext === 'jpg' ? 'jpg' : ext;
  return `${illustrationStem(questionNumber)}.${e}`;
}

/** Путь относительно public/ с заданным расширением (по умолчанию svg). */
export function illustrationPath(
  questionNumber: number,
  ext: IllustrationExtension = 'svg',
): string {
  return `${ILLUSTRATION_DIR}/${illustrationFileName(questionNumber, ext)}`;
}

/** @deprecated Используйте illustrationFileName(n, 'svg'). */
export function svgFileName(questionNumber: number): string {
  return illustrationFileName(questionNumber, 'svg');
}

/** @deprecated Используйте illustrationPath(n, 'svg'). */
export function svgPath(questionNumber: number): string {
  return illustrationPath(questionNumber, 'svg');
}

/** Публичный URL для <img src> / next/image (ведущий /). */
export function illustrationPublicUrl(relPath: string): string {
  return `/${relPath.replace(/^\/+/, '')}`;
}

/** Полная структура вопроса со связанными стихами (удобно для страницы). */
export interface QuestionWithVerses extends Question {
  verses: Verse[];
}

export function getQuestionWithVerses(
  questionNumber: number,
): QuestionWithVerses | undefined {
  const q = questions.find((x) => x.question_number === questionNumber);
  if (!q) return undefined;
  return { ...q, verses: versesForQuestion(questionNumber) };
}
