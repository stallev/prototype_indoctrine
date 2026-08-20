// Content pass: replace every `<!-- TODO adapt scene ... -->` marker in
// prompts/grok-card-prompts.md with the finished English scene sentence
// from scripts/grok-scene-descriptions.cjs. The "Scene: " label and the
// trailing modesty/style clause already live in the skeleton around the
// marker (see scripts/gen-grok-prompts-skeleton.cjs) — this pass inserts
// only the scene sentence itself, not a "Scene: " prefix.
//
// Usage: node scripts/apply-grok-scenes.cjs

const fs = require("node:fs");
const path = require("node:path");

const MD_PATH = path.join(__dirname, "..", "prompts", "grok-card-prompts.md");
const scenes = require("./grok-scene-descriptions.cjs");

function main() {
  const md = fs.readFileSync(MD_PATH, "utf8");
  const missing = [];

  // Split on question headers, replace the marker within each question's
  // block using its own question_number, so each marker maps to the right
  // scene regardless of ordering.
  const blocks = md.split(/(?=^### Вопрос \d+\.)/m);
  const rebuilt = blocks.map((block) => {
    const m = block.match(/^### Вопрос (\d+)\./m);
    if (!m) return block; // header/preamble before the first question
    const n = Number(m[1]);
    if (!(n in scenes)) {
      missing.push(n);
      return block;
    }
    return block.replace(
      /<!-- TODO adapt scene \(RU brief\): "(?:[^"\\]|\\.)*" -->/,
      scenes[n],
    );
  });

  if (missing.length > 0) {
    throw new Error(`Missing scene descriptions for: ${missing.join(", ")}`);
  }

  const finalMd = rebuilt.join("");
  fs.writeFileSync(MD_PATH, finalMd, "utf8");

  const remaining = (finalMd.match(/TODO adapt scene/g) || []).length;
  console.log(`Applied ${114 - missing.length} scenes. Remaining TODO markers: ${remaining}.`);
}

main();
