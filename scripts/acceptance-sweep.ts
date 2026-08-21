// Фаза 9.5.1 — автоматический обход всех 130 статических страниц
// (114 вопросов + 16 разделов) production-сборки Next.js, сверка
// отрендеренного SSR HTML с content/*.ts (прямой импорт, не повторный
// парсинг data/catechism.json).
//
// Постоянный скрипт (аналогично scripts/migrate-json-to-ts.ts) —
// перезапускаем при регрессиях/будущих ревизиях контента.
//
// Запуск: npx tsx scripts/acceptance-sweep.ts
//   (флаг --skip-build — пропустить `next build`, если сборка уже свежая)

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { QUESTIONS } from '../content/questions';
import { TOPICS } from '../content/topics';
import { questionsForTopic, versesForQuestion } from '../content';

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const PORT = 3922;
const BASE_URL = `http://localhost:${PORT}`;
const NEXT_BIN = createRequire(import.meta.url).resolve('next/dist/bin/next');

interface Mismatch {
  page: string;
  detail: string;
}

const mismatches: Mismatch[] = [];
let pagesChecked = 0;

function report(page: string, detail: string): void {
  mismatches.push({ page, detail });
}

/** Убирает React-комментарии-разделители гидратации (`<!-- -->`) между текстовыми узлами. */
function stripHydrationComments(html: string): string {
  return html.replace(/<!--\s*-->/g, '');
}

/** Декодирует минимальный набор HTML-сущностей, которые может вставить React SSR. */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function extractTagInnerHtml(html: string, openTagRegex: RegExp, closeTag: string): string | null {
  const match = openTagRegex.exec(html);
  if (!match) return null;
  const start = match.index + match[0].length;
  const end = html.indexOf(closeTag, start);
  if (end === -1) return null;
  return html.slice(start, end);
}

/**
 * Ограничивает разбор содержимым `<main>…</main>`. Обязательно: полная
 * страница также содержит постоянную desktop-панель оглавления
 * (components/nav-drawer.tsx) — она рендерит ссылки на ВСЕ вопросы ВСЕХ
 * разделов в DOM всегда (видимость через `hidden`, не условный рендер, см.
 * nav-topic-item.tsx), поэтому наивный поиск `href="/q/N"` по всему `html`
 * ловит их тоже — сравнивать нужно только контент `<main>`, не всю страницу.
 */
function extractMain(html: string): string {
  const start = html.indexOf('<main');
  const end = html.indexOf('</main>', start);
  if (start === -1 || end === -1) {
    throw new Error('<main>…</main> не найден в разметке страницы');
  }
  return html.slice(start, end);
}

async function waitForServer(timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE_URL}/q/1`);
      if (res.ok) return;
    } catch {
      // сервер ещё не поднялся — пробуем снова
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Production-сервер не ответил на ${BASE_URL}/q/1 за ${timeoutMs}мс`);
}

async function checkQuestionPage(questionNumber: number): Promise<void> {
  const page = `/q/${questionNumber}`;
  const res = await fetch(`${BASE_URL}${page}`);
  if (!res.ok) {
    report(page, `HTTP ${res.status}`);
    return;
  }
  const html = await res.text();
  const mainHtml = extractMain(html);
  pagesChecked += 1;

  const question = QUESTIONS.find((q) => q.question_number === questionNumber);
  if (!question) {
    report(page, `вопрос ${questionNumber} отсутствует в content/questions.ts`);
    return;
  }

  // --- Заголовок (h1) ---
  const h1Raw = extractTagInnerHtml(mainHtml, /<h1[^>]*>/, '</h1>');
  if (h1Raw === null) {
    report(page, 'h1 не найден в разметке');
  } else {
    const h1Text = decodeEntities(stripHydrationComments(h1Raw)).trim();
    const expectedTitle = `${question.question_number}. ${question.question_content}`;
    if (h1Text !== expectedTitle) {
      report(page, `заголовок "${h1Text}" !== ожидаемого "${expectedTitle}"`);
    }
  }

  // --- Ответ (первый <p> внутри article) ---
  const answerRaw = extractTagInnerHtml(
    mainHtml,
    /<p class="mt-3 text-base leading-relaxed[^"]*">/,
    '</p>',
  );
  if (answerRaw === null) {
    report(page, 'блок ответа (<p>) не найден в разметке');
  } else {
    const answerText = decodeEntities(stripHydrationComments(answerRaw)).trim();
    if (answerText !== question.answer) {
      report(page, `ответ "${answerText}" !== ожидаемого "${question.answer}"`);
    }
  }

  // --- Число стихов ---
  const expectedVerses = versesForQuestion(questionNumber);
  const renderedVerseCount = (
    mainHtml.match(/<li class="border-l-4 border-md-secondary\/40/g) ?? []
  ).length;
  if (renderedVerseCount !== expectedVerses.length) {
    report(
      page,
      `число стихов ${renderedVerseCount} !== ожидаемых ${expectedVerses.length}`,
    );
  }

  // --- Иллюстрация: путь/наличие ---
  const illustrationRel = question.illustration;
  const fileExists = illustrationRel !== null
    && existsSync(join(REPO_ROOT, 'public', illustrationRel));
  const isPlaceholder = mainHtml.includes('fill="#BFE3F0"/><circle cx="600" cy="450" r="120" fill="#FFFFFF" opacity="0.6"/>');
  const expectedAlt = `Иллюстрация к вопросу ${question.question_number}: ${question.question_content}`;
  if (!mainHtml.includes(`aria-label="${expectedAlt}"`)) {
    report(page, `alt/aria-label иллюстрации не совпадает с ожидаемым "${expectedAlt}"`);
  }
  if (fileExists && isPlaceholder) {
    report(page, `illustration="${illustrationRel}" существует на диске, но страница показывает плейсхолдер`);
  }
  if (!fileExists && !isPlaceholder) {
    report(
      page,
      `illustration="${illustrationRel ?? 'null'}" отсутствует на диске, но страница НЕ показывает плейсхолдер`,
    );
  }
}

async function checkTopicPage(topicId: number): Promise<void> {
  const page = `/topic/${topicId}`;
  const res = await fetch(`${BASE_URL}${page}`);
  if (!res.ok) {
    report(page, `HTTP ${res.status}`);
    return;
  }
  const html = await res.text();
  const mainHtml = extractMain(html);
  pagesChecked += 1;

  const topic = TOPICS.find((t) => t.topic_id === topicId);
  if (!topic) {
    report(page, `раздел ${topicId} отсутствует в content/topics.ts`);
    return;
  }

  // --- Заголовок раздела (h1) ---
  const h1Raw = extractTagInnerHtml(mainHtml, /<h1[^>]*>/, '</h1>');
  if (h1Raw === null) {
    report(page, 'h1 не найден в разметке');
  } else {
    const h1Text = decodeEntities(stripHydrationComments(h1Raw)).trim();
    if (h1Text !== topic.topic_name) {
      report(page, `заголовок раздела "${h1Text}" !== ожидаемого "${topic.topic_name}"`);
    }
  }

  // --- Состав и порядок вопросов раздела ---
  const expectedQuestions = questionsForTopic(topicId).map((q) => q.question_number);
  const renderedQuestions = Array.from(mainHtml.matchAll(/href="\/q\/(\d+)"/g)).map((m) =>
    Number(m[1]),
  );
  const sameOrder =
    expectedQuestions.length === renderedQuestions.length
    && expectedQuestions.every((n, i) => n === renderedQuestions[i]);
  if (!sameOrder) {
    report(
      page,
      `список/порядок вопросов [${renderedQuestions.join(',')}] !== ожидаемого [${expectedQuestions.join(',')}]`,
    );
  }
}

async function runSweep(): Promise<void> {
  for (const question of QUESTIONS) {
    await checkQuestionPage(question.question_number);
  }
  for (const topic of TOPICS) {
    await checkTopicPage(topic.topic_id);
  }
}

function buildApp(): void {
  console.log('> next build');
  const result = spawnSync(process.execPath, [NEXT_BIN, 'build'], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error(`next build завершился с кодом ${result.status}`);
  }
}

async function main(): Promise<void> {
  const skipBuild = process.argv.includes('--skip-build');
  if (!skipBuild) {
    buildApp();
  }

  console.log(`> next start -p ${PORT}`);
  const server = spawn(process.execPath, [NEXT_BIN, 'start', '-p', String(PORT)], {
    cwd: REPO_ROOT,
    stdio: 'ignore',
  });

  const cleanup = () => {
    if (!server.killed) server.kill();
  };
  process.on('exit', cleanup);

  try {
    await waitForServer(30_000);
    await runSweep();
  } finally {
    cleanup();
  }

  console.log('\n--- Acceptance sweep (Фаза 9.5.1) ---');
  console.log(`Страниц проверено: ${pagesChecked} (ожидается 130 = 114 вопросов + 16 разделов)`);
  console.log(`Расхождений найдено: ${mismatches.length}`);
  if (mismatches.length > 0) {
    console.log('\nДетали расхождений:');
    for (const m of mismatches) {
      console.log(`  [${m.page}] ${m.detail}`);
    }
  }

  process.exitCode = mismatches.length > 0 ? 1 : 0;
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.stack ?? err.message : String(err));
  process.exitCode = 1;
});
