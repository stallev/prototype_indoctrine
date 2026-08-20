// One-off script: generate the skeleton of prompts/grok-card-prompts.md —
// 114 self-contained English prompts for manual use in Grok Imagine, one
// per question, front-of-card illustration only (A6 print deck).
//
// Fills in every fixed part of each prompt (framing, doctrinal/modesty
// constraints, no-text instruction, style line, orientation) and leaves a
// `<!-- TODO adapt scene -->` marker carrying the existing Russian
// scene_brief for the content pass to expand into an English diffusion-
// ready scene description.
//
// Usage: node scripts/gen-grok-prompts-skeleton.cjs

const fs = require("node:fs");
const path = require("node:path");

const PROMPTS_TS = path.join(__dirname, "..", "prompts", "illustration-prompts.ts");
const CATECHISM_JSON = path.join(__dirname, "..", "data", "catechism.json");
const OUT_PATH = path.join(__dirname, "..", "prompts", "grok-card-prompts.md");

// Two short fields only — Text first, Scene second, everything else folded
// into short trailing clauses inside Scene. Earlier drafts used full
// English paragraphs (framing + doctrinal rules + style as separate
// sentences); Grok read that flowing prose as caption text and printed
// garbled fragments of the instructions themselves onto the card (seen in
// real generated samples). Keeping every field short and non-sentence-like,
// and leading with the exact quoted Text field, is the mitigation — still
// unverified against Grok directly, since nothing here can call the tool.
function buildTextLine(entry) {
  return `Text — the ONLY text anywhere in this image, nothing else added anywhere: "${entry.question_number}. ${entry.question_content}". Centered exactly both horizontally and vertically, large bold Russian font.`;
}

function buildSceneLine(entry) {
  const sceneMarker = `<!-- TODO adapt scene (RU brief): "${entry.scene_brief}" -->`;
  return `Scene: ${sceneMarker} Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.`;
}

const HEADER = `# Промпты для Grok Imagine — печатные карточки катехизиса (A6)

Для ручной генерации в Grok Imagine, по одному промпту за раз. Каждый промпт — только
лицевая сторона карточки (иллюстрация); оборот (ответ + стих на цветной подложке, без
иллюстрации) в этот файл не входит — вёрстка обеих сторон делается отдельным, ещё не
спроектированным шагом (наложение текста и печатной подложки поверх сгенерированного
изображения, не самим Grok).

**Печатные параметры (справочно, не гарантия точного вывода Grok):**
A6, портрет, 105×148 мм; вылет под обрез ~3 мм (итого ~111×154 мм); ориентир разрешения
под печать 300dpi — ~1240×1748 px по обрезу / ~1311×1819 px с вылетом. Точную подгонку
размера/обреза делает следующий, отдельный шаг вёрстки — не сама генерация в Grok.

**Стиль:** свободная живописная палитра (не связана с фиксированной hex-палитрой сайта
из \`specs/svg-illustration-spec.md\` §3) — печатная колода намеренно развязана визуально
с SVG-иллюстрациями сайта.
**Язык промптов:** английский (диффузионные модели, включая Grok, в среднем точнее следуют
промптам на английском).
**Формат записи:** каждый из 114 промптов самодостаточен — полностью дублирует жёсткие
правила и запрет текста, чтобы промпт можно было скопировать в Grok по одному, ничего не
потеряв из общих ограничений.
**Текст на карточке (вторая итерация формата, после двух неудачных попыток):**
1. Первая версия промпта (длинная проза: рамка + жёсткие правила + стиль отдельными
   абзацами) заставила Grok напечатать куски самого промпта, включая абзац правил, как
   нечитаемый текст поверх картинки.
2. Вторая версия сократила абзацы и явно попросила «не печатай инструкции как текст» —
   не помогло: Grok всё равно напечатал огрызки английской прозы («No visible figue or
   God...»), хоть заголовок на русском при этом уже центрировался верно.
3. Текущая (третья) версия — это ровно **два** поля на промпт, оба короткие и не похожие
   на «абзац текста»: «Text: "N. Вопрос"» — идёт первым, с жёстким требованием (по словам
   пользователя) единственного текста в кадре, отцентрированного и по горизонтали, и по
   вертикали; «Scene: ...» — одно предложение сцены с доктринальными ограничениями,
   свёрнутыми в короткие хвостовые фразы того же предложения, а не отдельным абзацем
   правил. Гипотеза: чем длиннее и «прозаичнее» текст в промпте, тем охотнее Grok решает,
   что это и есть подпись для карточки, а не инструкция — поэтому убраны все
   многопредложенческие блоки, а не только их формулировка.

Эта гипотеза не проверена мной напрямую (нет доступа к Grok из этой сессии) — если текст
всё ещё просачивается и на этой версии, следующий шаг — полностью убрать доктринальные
правила и стиль из текста промпта и переносить весь текст карточки (номер+вопрос) отдельным
наложением поверх уже готовой чистой иллюстрации, а не просить Grok рисовать текст вообще.

Диффузионные модели, включая Grok, всё равно ненадёжно рендерят кириллицу и позиционирование —
каждую сгенерированную карточку нужно проверять глазами и при необходимости перегенерировать.

**Внешность и одежда:** требование строгого соответствия консервативной христианской традиции
явно прописано в каждом промпте (в поле \`Scene:\`) отдельно для женщин/девочек и мужчин/мальчиков —
одежда (платье/юбка ниже колена, длинный рукав, закрытый вырез, без брюк/шорт у женщин; полностью
закрытая одежда без открытого торса у мужчин) и причёска (длинные, аккуратно убранные или покрытые
волосы у женщин; короткая аккуратная стрижка у мужчин). Сформулировано короткими фразами внутри
того же предложения сцены, а не отдельным абзацем — по той же причине, что и выше.

Источник сюжета (\`scene_brief\`) для каждого вопроса — \`prompts/illustration-prompts.ts\`;
русская подсказка сцены переработана в развёрнутое английское диффузионное описание (не
дословный перевод). Доктринальные ограничения — \`specs/svg-illustration-spec.md\` §2/§7;
таблица чувствительных вопросов (§7) требует повышенной проверки для номеров:
1, 4, 43–52, 58–61, 107 (Божество); 24–27, 31, 35–37 (Адам и Ева); 41–42, 91, 111–112
(гнев/ад); 108 (суд); 109–110 (смерть/воскресение); 62, 69–70, 73–74 (заповеди/скрижали);
97–101 (крещение/вечеря); 113–114 (рай).

---
`;

function buildPromptBlock(entry) {
  return [buildTextLine(entry), "", buildSceneLine(entry)].join("\n");
}

function main() {
  const { illustrationPrompts } = require(PROMPTS_TS);
  const { topics } = JSON.parse(fs.readFileSync(CATECHISM_JSON, "utf8"));

  const byTopic = new Map(topics.map((t) => [t.topic_id, []]));
  for (const entry of illustrationPrompts) {
    if (!byTopic.has(entry.topic_id)) {
      throw new Error(`Unknown topic_id ${entry.topic_id} for question ${entry.question_number}`);
    }
    byTopic.get(entry.topic_id).push(entry);
  }

  let out = HEADER;
  for (const topic of topics) {
    const entries = byTopic.get(topic.topic_id).sort((a, b) => a.question_number - b.question_number);
    if (entries.length === 0) continue;

    out += `\n## Раздел ${topic.topic_id}. ${topic.topic_name}\n`;
    for (const entry of entries) {
      out += `\n### Вопрос ${entry.question_number}. ${entry.question_content}\n\n`;
      out += buildPromptBlock(entry) + "\n";
    }
  }

  fs.writeFileSync(OUT_PATH, out, "utf8");
  console.log(`Wrote ${OUT_PATH} (${illustrationPrompts.length} questions).`);
}

main();
