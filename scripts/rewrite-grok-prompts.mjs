/**
 * Переписывает prompts/grok-card-prompts.md:
 * - оранжевый цвет текста (C)
 * - People: none | People: exactly N — пол/возраст; одежда только если есть люди (B)
 * - усиливает точность кириллицы в Text (A)
 */
import fs from 'node:fs';

const PATH = new URL('../prompts/grok-card-prompts.md', import.meta.url);

const MODESTY_BLOCK =
  / Conservative Christian modesty: women\/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men\/boys in fully covered clothing, no bare chest, short neat hairstyle\./;

const TRAILER =
  / Nothing frightening, no visible God\/Jesus\/Spirit figure\. Warm soft painterly light\./;

const MODESTY_SHORT =
  'Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle.';

/** Ручная спецификация людей по номеру вопроса (1–114). null = без людей. */
const PEOPLE = {
  1: 'People: exactly 2 — one boy age ~7 and one girl age ~7, standing together in the meadow.',
  2: 'People: exactly 1 — one child age ~7 (boy or girl), standing with arms raised.',
  3: 'People: none — no humans, no faces, no human figures in the frame.',
  4: 'People: none — no humans, no faces, no human figures in the frame.',
  5: 'People: exactly 1 — one boy age ~7–8, sitting under a tree and reading.',
  6: 'People: none — no humans, no faces, no human figures in the frame.',
  7: 'People: none — no humans, no faces, no human figures in the frame.',
  8: 'People: none — no humans, no faces, no human figures in the frame.',
  9: 'People: exactly 1 — one child age ~7–8, standing on a hill.',
  10: 'People: none — no humans, no faces, no human figures in the frame.',
  11: 'People: none — no humans, no faces, no human figures in the frame.',
  12: 'People: none — no humans, no faces, no human figures in the frame.',
  13: 'People: none — no humans, no faces, no human figures in the frame.',
  14: 'People: none — no humans, no faces, no human figures in the frame.',
  15: 'People: exactly 1 — one boy age ~7–8, standing in prayer with eyes closed.',
  16: 'People: none — no humans, no faces, no human figures in the frame.',
  17: 'People: none — no humans, no faces, no human figures in the frame.',
  18: 'People: none — no humans, no faces, no human figures in the frame.',
  19: 'People: none — no humans, no faces, no human figures in the frame.',
  20: 'People: none — no humans, no faces, no human figures in the frame.',
  21: 'People: none — no humans, no faces, no human figures in the frame.',
  22: 'People: none — no humans, no faces, no human figures in the frame.',
  23: 'People: none — no humans, no faces, no human figures in the frame.',
  24: 'People: exactly 1 — one adult man (Adam), back to viewer, adult age ~30.',
  25: 'People: exactly 1 — one adult woman (Eve), adult age ~30, at a gentle distance.',
  26: 'People: none — no humans, no faces, no human figures in the frame (hands/earth only as objects, no person visible).',
  27: 'People: exactly 2 — one adult man sleeping (Adam, ~30) and one adult woman silhouette nearby (Eve, ~30).',
  28: 'People: exactly 2 — one adult man (Adam, ~30) and one adult woman (Eve, ~30), standing together.',
  29: 'People: exactly 1 — one boy age ~7–8, hand over heart.',
  30: 'People: exactly 1 — one child age ~7–8, reading a Bible under a tree.',
  31: 'People: exactly 2 — one adult man (Adam, ~30) and one adult woman (Eve, ~30), standing together.',
  32: 'People: none — no humans, no faces, no human figures in the frame.',
  33: 'People: exactly 1 — one small distant human figure (child age ~7–8), wandering toward the signpost.',
  34: 'People: exactly 1 — one child age ~7–8, standing with back to an open book, head lowered.',
  35: 'People: exactly 2 — one adult man (Adam, ~30) and one adult woman (Eve, ~30), near the garden entrance.',
  36: 'People: exactly 2 — two distant adult human figures (Adam and Eve, ~30), far from the tree.',
  37: 'People: exactly 2 — two small distant figures (Adam and Eve as adults ~30), walking away from closing gates.',
  38: 'People: exactly 5 — five identical small child silhouettes (ages ~6–8), walking in a line; gender not distinct at distance.',
  39: 'People: exactly 1 — one child age ~7–8, walking a sunlit path.',
  40: 'People: exactly 1 — one child age ~7–8, standing at a fork of paths.',
  41: 'People: none — no humans, no faces, no human figures in the frame.',
  42: 'People: exactly 1 — one child age ~7–8, standing outside closed gates, off to the side.',
  43: 'People: none — no humans, no faces, no human figures in the frame.',
  44: 'People: none — no humans, no faces, no human figures in the frame.',
  45: 'People: none — no humans, no faces, no human figures in the frame.',
  46: 'People: exactly 1 — one adult woman (Mary, ~20–25), headscarf, seen gently from behind beside the manger.',
  47: 'People: none — no humans, no faces, no human figures in the frame.',
  48: 'People: none — no humans, no faces, no human figures in the frame.',
  49: 'People: none — no humans, no faces, no human figures in the frame.',
  50: 'People: none — no humans, no faces, no human figures in the frame.',
  51: 'People: none — no humans, no faces, no human figures in the frame.',
  52: 'People: exactly 6 — a small scattered crowd of about six modest adult silhouettes (mixed men and women, adult ages), quiet below the cross; faces not detailed.',
  53: 'People: exactly 1 — one child age ~7–8, kneeling on a path.',
  54: 'People: exactly 1 — one child age ~7–8, kneeling with head bowed.',
  55: 'People: exactly 1 — one child age ~7–8, standing with open palms raised.',
  56: 'People: exactly 1 — one child age ~7–8, kneeling in prayer beneath a tree.',
  57: 'People: exactly 1 — one adult biblical man in a simple tunic (age ~30–40), gazing toward a star.',
  58: 'People: none — no humans, no faces, no human figures in the frame.',
  59: 'People: none — no humans, no faces, no human figures in the frame.',
  60: 'People: none — no humans, no faces, no human figures in the frame.',
  61: 'People: none — no humans, no faces, no human figures in the frame.',
  62: 'People: none — no humans, no faces, no human figures in the frame.',
  63: 'People: none — no humans, no faces, no human figures in the frame.',
  64: 'People: exactly 4 — two adults (one man ~35, one woman ~35) and two children (boy ~7, girl ~7), holding hands on a meadow.',
  65: 'People: exactly 2 — one child age ~7–8 helping one elderly person (man or woman, age ~70) along a path.',
  66: 'People: exactly 2 — two adult travelers (two men ~30–40, or one man and one woman), one helping the other rise.',
  67: 'People: none — no humans, no faces, no human figures in the frame.',
  68: 'People: exactly 1 — one child age ~7–8, praying alone on a hillside.',
  69: 'People: exactly 1 — one child age ~7–8, looking away from a broken statue toward the light.',
  70: 'People: exactly 1 — one child age ~7–8, holding an open Bible in a meadow.',
  71: 'People: exactly 1 — one child age ~7–8, standing calmly with head bowed.',
  72: 'People: exactly 1 — one child age ~7–8, sitting quietly with eyes closed.',
  73: 'People: none — no humans, no faces, no human figures in the frame.',
  74: 'People: exactly 5 — one family: father ~35, mother ~35, three children ages ~5–10 (mixed boys/girls), relaxing on grass.',
  75: 'People: none — no humans, no faces, no human figures in the frame.',
  76: 'People: exactly 4 — one family walking: father ~35, mother ~35, boy ~7, girl ~7, hand in hand.',
  77: 'People: exactly 3 — one child age ~7–8 holding hands of one adult man (~35) and one adult woman (~35).',
  78: 'People: exactly 3 — one child age ~7–8 and two modest adults (man ~35, woman ~35) helping in a garden.',
  79: 'People: exactly 2 — two children ages ~7–8 (one boy, one girl), playing peacefully under a tree.',
  80: 'People: exactly 2 — two children ages ~7–8 (one boy, one girl), playing happily on a meadow.',
  81: 'People: exactly 4 — one family: father ~35, mother ~35, boy ~7, girl ~7, walking toward home.',
  82: 'People: exactly 1 — one child age ~7–8, walking upright on a bright path.',
  83: 'People: exactly 2 — two children ages ~7–8 (one boy, one girl); one returns a found item to the other.',
  84: 'People: exactly 2 — two children ages ~7–8 (one boy, one girl), exchanging a gift.',
  85: 'People: exactly 2 — two children ages ~7–8 (one boy, one girl), talking face to face.',
  86: 'People: exactly 1 — one child age ~7–8, looking ahead openly, hand on chest.',
  87: 'People: exactly 1 — one child age ~7–8, sitting contentedly with their own basket of fruit.',
  88: 'People: exactly 1 — one child age ~7–8, sitting on a doorstep with simple food.',
  89: 'People: none — no humans, no faces, no human figures in the frame.',
  90: 'People: none — no humans, no faces, no human figures in the frame.',
  91: 'People: none — no humans, no faces, no human figures in the frame.',
  92: 'People: exactly 1 — one child age ~7–8, kneeling on a bright path toward a distant cross.',
  93: 'People: exactly 1 — one child age ~7–8, reaching open palms toward light.',
  94: 'People: exactly 1 — one child age ~7–8, kneeling with head bowed beside a stone.',
  95: 'People: exactly 5 — one child age ~7–8 with a Bible, plus two other children (~7) and two adults (~35), praying together.',
  96: 'People: exactly 1 — one child age ~7–8, reading an open Bible at a table by a window.',
  97: 'People: none — no humans, no faces, no human figures in the frame.',
  98: 'People: none — no humans, no faces, no human figures in the frame.',
  99: 'People: none — no humans, no faces, no human figures in the frame.',
  100: 'People: none — no humans, no faces, no human figures in the frame.',
  101: 'People: exactly 4 — four modest adults (two men ~35–45, two women ~35–45) seated quietly around a table with bread and cup.',
  102: 'People: exactly 1 — one child age ~7–8, kneeling beside a bed in prayer.',
  103: 'People: exactly 1 — one child age ~7–8, praying with an open Bible on the table.',
  104: 'People: none — no humans, no faces, no human figures in the frame.',
  105: 'People: exactly 1 — one child age ~7–8, praying on knees in a field at sunset.',
  106: 'People: none — no humans, no faces, no human figures in the frame.',
  107: 'People: none — no humans, no faces, no human figures in the frame.',
  108: 'People: none — no humans in the frame (sheep, goats, and a shepherd staff only; no shepherd figure).',
  109: 'People: none — no humans, no faces, no human figures in the frame.',
  110: 'People: none — no humans, no faces, no human figures in the frame.',
  111: 'People: none — no humans, no faces, no human figures in the frame.',
  112: 'People: none — no humans, no faces, no human figures in the frame.',
  113: 'People: none — no humans, no faces, no human figures in the frame.',
  114: 'People: none — no humans, no faces, no human figures in the frame.',
};

const OLD_TEXT_SUFFIX =
  'Centered exactly both horizontally and vertically, large bold Arial typeface, Russian. Hard rule: font family Arial only.';

const NEW_TEXT_SUFFIX =
  'Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.';

let text = fs.readFileSync(PATH, 'utf8');

// Header: clothing section + orange text note
text = text.replace(
  /\*\*Жёсткие правила текста \(дублируются в каждом промпте\):\*\*\n1\. Гарнитура единственного текста на карточке — \*\*Arial\*\*\./,
  `**Жёсткие правила текста (дублируются в каждом промпте):**
1. Гарнитура единственного текста на карточке — **Arial**.
2. Цвет текста — **оранжевый** (\`#FF8C00\`).
3. Кириллица — **буквально** как в кавычках после \`Text —\`, без опечаток и лишних слов.`,
);

text = text.replace(
  /\*\*Внешность и одежда:\*\*[^\n]*\n(?:[^\n]*\n)*?того же предложения сцены, а не отдельным абзацем — по той же причине, что и выше\./,
  `**Люди и одежда:** в каждом \`Scene:\` явно указано \`People: none\` или \`People: exactly N\` с полом и возрастом.
Одежда/причёска (conservative Christian modesty) — **только** если в кадре есть люди; для сцен без людей эти требования не добавляются.`,
);

// Text lines
if (!text.includes(OLD_TEXT_SUFFIX)) {
  console.error('OLD_TEXT_SUFFIX not found');
  process.exit(1);
}
text = text.replaceAll(OLD_TEXT_SUFFIX, NEW_TEXT_SUFFIX);

// Scene lines
const sceneRe = /^Scene: (.+)$/gm;
let qi = 0;
text = text.replace(sceneRe, (full, sceneBody) => {
  qi += 1;
  const n = qi;
  let core = sceneBody.replace(MODESTY_BLOCK, '').replace(TRAILER, '').trim();
  // Strip trailing period duplicates
  core = core.replace(/\.\s*$/, '');
  const people = PEOPLE[n];
  if (!people) {
    console.error('Missing PEOPLE for', n);
    process.exit(1);
  }
  const hasPeople = !people.startsWith('People: none');
  const modesty = hasPeople ? ` ${MODESTY_SHORT}` : '';
  return `Scene: ${core}. ${people}${modesty} Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.`;
});

if (qi !== 114) {
  console.error('Expected 114 scenes, got', qi);
  process.exit(1);
}

fs.writeFileSync(PATH, text);
console.log('Updated', PATH.pathname, 'scenes:', qi);
const none = Object.values(PEOPLE).filter((p) => p.startsWith('People: none')).length;
const withP = 114 - none;
console.log('People:none', none, 'with people', withP);
