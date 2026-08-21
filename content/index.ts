// Хелперы для чтения контента катехизиса.
//
// Источник данных — content/topics.ts, questions.ts, verses.ts,
// question-verses.ts (сгенерированы scripts/migrate-json-to-ts.ts из
// data/catechism.json, целостность гарантирована на этапе генерации —
// см. docs/contracts/content-data-contract.md §3).
//
// Порт одноимённых функций utils/catechism.ts: сигнатуры и поведение
// не меняются, меняется только источник массивов.

import { TOPICS } from './topics';
import { QUESTIONS } from './questions';
import { VERSES } from './verses';
import { QUESTION_VERSES } from './question-verses';

export type Topic = (typeof TOPICS)[number];
export type Question = (typeof QUESTIONS)[number];
export type Verse = (typeof VERSES)[number];
export type QuestionVerse = (typeof QUESTION_VERSES)[number];

const verseById = new Map<number, Verse>(VERSES.map((v) => [v.id, v]));

/** Стихи для вопроса, в порядке цитирования. */
export function versesForQuestion(questionNumber: number): Verse[] {
  return QUESTION_VERSES.filter((l) => l.question_id === questionNumber)
    .sort((a, b) => a.position - b.position)
    .map((l) => verseById.get(l.verse_id))
    .filter((v): v is Verse => v !== undefined);
}

/** Вопросы раздела, отсортированные по номеру. */
export function questionsForTopic(topicId: number): Question[] {
  return QUESTIONS.filter((q) => q.topic_id === topicId).sort(
    (a, b) => a.question_number - b.question_number,
  );
}

/** Тема по id. */
export function getTopic(topicId: number): Topic | undefined {
  return TOPICS.find((t) => t.topic_id === topicId);
}

/** Все темы. */
export function allTopics(): Topic[] {
  return [...TOPICS];
}

// --- Иллюстрации ---
// Хранение: путь в поле illustration, файлы в public/illustrations/.
// SVG — инлайн на сборке; png/jpg/jpeg/webp — URL для <img>.
// Чтение с диска — в lib/illustrations.ts (только сервер/сборка).

/** Каталог иллюстраций относительно public/. */
export const ILLUSTRATION_DIR = 'illustrations';

/** Допустимые расширения иллюстраций (путь относительно public/). */
export type IllustrationExtension = 'svg' | 'png' | 'jpg' | 'jpeg' | 'webp';

/** Стем имени без расширения: q001. */
export function illustrationStem(questionNumber: number): string {
  return `q${String(questionNumber).padStart(3, '0')}`;
}

/** Путь относительно public/ с заданным расширением (по умолчанию svg). */
export function illustrationPath(
  questionNumber: number,
  ext: IllustrationExtension = 'svg',
): string {
  return `${ILLUSTRATION_DIR}/${illustrationStem(questionNumber)}.${ext}`;
}

/** Публичный URL для <img src> / next/image (ведущий /). */
export function illustrationPublicUrl(relPath: string): string {
  return `/${relPath.replace(/^\/+/, '')}`;
}

/** Полная структура вопроса со связанными стихами (удобно для страницы). */
export function getQuestionWithVerses(
  questionNumber: number,
): (Question & { verses: Verse[] }) | undefined {
  const q = QUESTIONS.find((x) => x.question_number === questionNumber);
  if (!q) return undefined;
  return { ...q, verses: versesForQuestion(questionNumber) };
}
