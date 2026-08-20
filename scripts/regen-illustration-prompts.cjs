// One-off script: rebuild only the `prompt` field of every entry in
// prompts/illustration-prompts.ts from the updated §8 template in
// specs/svg-illustration-spec.md (layered-composition instruction + raised
// node/size budget). Leaves the other 7 fields per entry untouched.
//
// Mechanism: locate each entry's `prompt: "..."` literal in the raw file
// text via unique `question_number: N,` anchors, validate the extracted
// literal against Node's own require() of the file before touching
// anything, then splice in a freshly-built, JSON-encoded replacement.
// Writes to a `.new` file for review; does not overwrite the original.
//
// Usage: node scripts/regen-illustration-prompts.cjs

const fs = require("node:fs");
const path = require("node:path");

const SRC_PATH = path.join(__dirname, "..", "prompts", "illustration-prompts.ts");
const OUT_PATH = SRC_PATH + ".new";

const HEADER = `Ты генерируешь ОДНУ SVG-иллюстрацию для карточки детского катехизиса.
Аудитория: дети 6–8 лет из консервативных баптистских семей.

ВЕРНИ ТОЛЬКО валидный SVG-код, без пояснений и без markdown-обёртки.

ЖЁСТКИЕ ПРАВИЛА (нарушать нельзя):
- НЕ изображай Бога, Иисуса Христа, Святого Духа (ни лицо, ни фигуру, ни руку из облака).
  Божье действие показывай косвенно: свет, творение, крест, пустая гробница, корона, действие человека.
- Модесть: женщины/девочки — только платье или юбка ниже колена, длинный рукав, закрытый вырез,
  свободный силуэт, БЕЗ брюк/шорт/облегающего/открытого. Мужчины/мальчики — закрытая одежда,
  без обнажённого торса. Адам и Ева — только скромно одеты или на отдалении, БЕЗ наготы.
- Без страха: ад/смерть/суд — мягко и символически, без огня с людьми, тел, крови, чудовищ.
- Без текста и букв внутри рисунка (только <title> для доступности).

СТИЛЬ:
- Плоский вектор: сплошные заливки + простые градиенты. Скруглённые формы.
- Без имитации живописи, без шума, без тяжёлых фильтров-блюров.
- Одна ясная спокойная сцена, крупный понятный силуэт, тёплое доброе настроение.
- Композиция слоями: фон (небо/даль) → средний план (холмы/строения/растения) → передний план
  (главный субъект + 1–2 второстепенных предмета/детали). Не оставляй пустых плоских зон —
  используй доступный бюджет узлов на светотеневые акценты, вторичную растительность,
  складки одежды, мелкие декоративные детали, не выходя за рамки палитры и техники.
- Палитра — использовать ТОЛЬКО эти цвета:
  небо #BFE3F0/#8FCFE6, белый #FFFFFF, бирюза #7FB4B0, зелень #9FCF6E/#5E9E5A/#A9C5A0,
  золото/песок #F2C94C/#E9CE8E, коричневый #8B5A2B/#A0653A, коралл #EB8A73,
  кожа #F1C9A5/#D9A878, свечение/солнце #FCE39A, тёмно-синий #3D5A80.

ТЕХНИКА:
- Один <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"
  preserveAspectRatio="xMidYMid meet">, фон на всю область.
- Только векторные примитивы. Без <image>, <script>, base64, внешних ссылок.
- До ~200 узлов, до ~20 КБ. Добавь короткий <title>.`;

const SCENE_TASK = `ЗАДАЧА СЦЕНЫ:
Придумай простую конкретную сцену, понятную ребёнку 6–8 лет, отражающую ОТВЕТ.
Приоритет: творение/природа → ребёнок в действии → библейский предмет-символ → библейская сцена (без Божества).
Рекомендация по сцене: `;

function verseLine(entry) {
  if (entry.verse_reference === null) return "";
  if (entry.verse_text === null) return `\n- Стих: ${entry.verse_reference}`;
  return `\n- Стих: ${entry.verse_reference} — ${entry.verse_text}`;
}

function buildPrompt(entry) {
  const card = `КАРТОЧКА:
- Номер вопроса: ${entry.question_number}
- Вопрос: ${entry.question_content}
- Ответ: ${entry.answer}${verseLine(entry)}`;

  return `${HEADER}\n\n${card}\n\n${SCENE_TASK}${entry.scene_brief}`;
}

function main() {
  const { illustrationPrompts } = require(SRC_PATH);
  if (illustrationPrompts.length !== 114) {
    throw new Error(`Expected 114 entries, got ${illustrationPrompts.length}`);
  }

  const raw = fs.readFileSync(SRC_PATH, "utf8");
  let result = "";
  let cursor = 0;

  for (let n = 1; n <= 114; n++) {
    const entry = illustrationPrompts.find((e) => e.question_number === n);
    if (!entry) throw new Error(`Missing entry for question_number ${n}`);

    const startAnchor = `question_number: ${n},`;
    const entryStart = raw.indexOf(startAnchor, cursor);
    if (entryStart === -1) throw new Error(`Anchor not found for N=${n}: ${startAnchor}`);

    const nextAnchor = n < 114 ? `question_number: ${n + 1},` : "\n];";
    const entryEnd = raw.indexOf(nextAnchor, entryStart);
    if (entryEnd === -1) throw new Error(`End anchor not found for N=${n}`);

    const chunk = raw.slice(entryStart, entryEnd);

    const promptFieldMarker = 'prompt: "';
    const pFieldStart = chunk.indexOf(promptFieldMarker);
    if (pFieldStart === -1) throw new Error(`prompt field not found for N=${n}`);
    const pStart = pFieldStart + promptFieldMarker.length - 1; // index of opening "

    const terminator = '",\n  },';
    const pTermIdx = chunk.lastIndexOf(terminator);
    if (pTermIdx === -1) throw new Error(`prompt terminator not found for N=${n}`);
    const pEnd = pTermIdx; // index of closing " (inclusive)

    const oldLiteral = chunk.slice(pStart, pEnd + 1);
    let oldParsed;
    try {
      oldParsed = JSON.parse(oldLiteral);
    } catch (err) {
      throw new Error(`Failed to JSON.parse old prompt literal for N=${n}: ${err.message}`);
    }
    if (oldParsed !== entry.prompt) {
      throw new Error(`Extracted literal mismatch for N=${n} — aborting, no file written.`);
    }

    const newPrompt = buildPrompt(entry);
    const newLiteral = JSON.stringify(newPrompt);

    const absPStart = entryStart + pStart;
    const absPEnd = entryStart + pEnd; // inclusive index of closing "

    result += raw.slice(cursor, absPStart) + newLiteral;
    cursor = absPEnd + 1;
  }

  result += raw.slice(cursor);

  fs.writeFileSync(OUT_PATH, result, "utf8");
  console.log(`Wrote ${OUT_PATH} (${result.length} bytes). Run the verification script next.`);
}

main();
