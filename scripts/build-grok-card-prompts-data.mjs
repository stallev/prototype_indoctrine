/** Собирает prompts/grok-card-prompts-data.ts из prompts/grok-card-prompts.md */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const mdPath = path.join(root, 'prompts', 'grok-card-prompts.md');
const outPath = path.join(root, 'prompts', 'grok-card-prompts-data.ts');

const NO_TEXT_SUFFIX =
  ' Hard rule: no text, letters, words, numbers, captions, or typography anywhere in the image — illustration only.';

const text = fs.readFileSync(mdPath, 'utf8');

const titles = [];
const titleRe = /^###[^\n]*?(\d+)\.\s*(.+)$/gm;
let m;
while ((m = titleRe.exec(text))) {
  titles.push({ n: Number(m[1]), t: m[2] });
}

const textLines = [...text.matchAll(/^Text — .+$/gm)].map((x) => x[0]);
const scenes = [...text.matchAll(/^Scene: .+$/gm)].map((x) => x[0]);

if (titles.length !== 114 || textLines.length !== 114 || scenes.length !== 114) {
  throw new Error(
    `Count mismatch: titles=${titles.length} texts=${textLines.length} scenes=${scenes.length}`,
  );
}

const entries = titles.map((q, i) => {
  const textLine = textLines[i];
  const quoteMatch = textLine.match(/:\s*"([^"]+)"/);
  const cardText = quoteMatch?.[1] ?? `${q.n}. ${q.t}`;
  const sceneLine = scenes[i];
  // В API уходит только сцена без просьбы рисовать кириллицу — текст
  // накладывается в браузере (lib/overlay-card-text.ts).
  const scenePrompt = `${sceneLine}${NO_TEXT_SUFFIX}`;
  return {
    questionNumber: q.n,
    label: `${q.n}. ${q.t}`,
    cardText,
    scenePrompt,
    /** Полный markdown-промпт (справочно / ручной режим). */
    prompt: `${textLine}\n\n${sceneLine}`,
  };
});

const body = `/**
 * Автогенерация из prompts/grok-card-prompts.md.
 * Пересобрать: node scripts/build-grok-card-prompts-data.mjs
 *
 * cardText — точная кириллическая подпись (накладывается Canvas после генерации).
 * scenePrompt — промпт для модели: только сцена, без текста на картинке.
 */

export interface GrokCardPromptOption {
  questionNumber: number;
  label: string;
  /** Текст для наложения на картинку (Arial, оранжевый) — точная кириллица. */
  cardText: string;
  /** Промпт для generateImage: Scene + запрет любого текста в кадре. */
  scenePrompt: string;
  /** Полный промпт из markdown (Text + Scene), для справки. */
  prompt: string;
}

export const GROK_CARD_PROMPTS: GrokCardPromptOption[] = ${JSON.stringify(entries, null, 2)};

export function getGrokCardPrompt(
  questionNumber: number,
): GrokCardPromptOption | undefined {
  return GROK_CARD_PROMPTS.find((p) => p.questionNumber === questionNumber);
}
`;

fs.writeFileSync(outPath, body, 'utf8');
const maxLen = Math.max(...entries.map((e) => e.scenePrompt.length));
console.log(`Wrote ${entries.length} prompts → ${path.relative(root, outPath)} (max scene ${maxLen} chars)`);
