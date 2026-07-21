// Browser-порт хелперов из utils/catechism.ts — без Zod, без импорта JSON
// на этапе модуля. Данные передаются через initCatechism(data) после fetch.
// Контракт: docs/static-prototype-spec.md §7.2.

let topics = [];
let questions = [];
let verses = [];
let verseById = new Map();
let questionByNumber = new Map();
let verseLinksByQuestionId = new Map();

export function initCatechism(data) {
  topics = data.topics;
  questions = data.questions;
  verses = data.verses;

  verseById = new Map(verses.map((v) => [v.id, v]));
  questionByNumber = new Map(questions.map((q) => [q.question_number, q]));

  verseLinksByQuestionId = new Map();
  for (const link of data.question_verses) {
    const links = verseLinksByQuestionId.get(link.question_id) ?? [];
    links.push(link);
    verseLinksByQuestionId.set(link.question_id, links);
  }
}

export function allTopics() {
  return topics;
}

export function getTopic(topicId) {
  return topics.find((t) => t.topic_id === topicId);
}

export function questionsForTopic(topicId) {
  return questions
    .filter((q) => q.topic_id === topicId)
    .sort((a, b) => a.question_number - b.question_number);
}

export function versesForQuestion(questionNumber) {
  const links = verseLinksByQuestionId.get(questionNumber) ?? [];
  return links
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((link) => verseById.get(link.verse_id))
    .filter((v) => v !== undefined);
}

export function getQuestionWithVerses(questionNumber) {
  const q = questionByNumber.get(questionNumber);
  if (!q) return undefined;
  return { ...q, verses: versesForQuestion(questionNumber) };
}

export const ILLUSTRATION_DIR = 'illustrations';

export function illustrationStem(questionNumber) {
  return `q${String(questionNumber).padStart(3, '0')}`;
}

export function illustrationPath(questionNumber, ext = 'svg') {
  return `${ILLUSTRATION_DIR}/${illustrationStem(questionNumber)}.${ext}`;
}

// Прототип раздаётся как есть (static server в корне репозитория), поэтому
// URL — относительный к public/, а не абсолютный /public/… (см. §8.1).
export function illustrationPublicUrl(relPath) {
  return `public/${relPath.replace(/^\/+/, '')}`;
}
