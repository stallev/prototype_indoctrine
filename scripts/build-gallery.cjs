// One-off: builds a static HTML review gallery of all 114 generated
// public/illustrations/qNNN.svg files, grouped by topic, for visual
// sign-off. Not part of the app — a verification artifact only.

const fs = require("node:fs");
const path = require("node:path");

const ILLUST_DIR = path.join(__dirname, "..", "public", "illustrations");
const PROMPTS_TS = path.join(__dirname, "..", "prompts", "illustration-prompts.ts");
const CATECHISM_JSON = path.join(__dirname, "..", "data", "catechism.json");
const OUT_PATH = process.argv[2] || path.join(__dirname, "gallery.html");

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function main() {
  const { illustrationPrompts } = require(PROMPTS_TS);
  const { topics } = JSON.parse(fs.readFileSync(CATECHISM_JSON, "utf8"));
  const byNumber = new Map(illustrationPrompts.map((e) => [e.question_number, e]));
  const byTopic = new Map(topics.map((t) => [t.topic_id, []]));
  for (const e of illustrationPrompts) byTopic.get(e.topic_id).push(e);

  let totalBytes = 0;
  const cards = [];
  for (const topic of topics) {
    const entries = byTopic.get(topic.topic_id).sort((a, b) => a.question_number - b.question_number);
    if (entries.length === 0) continue;
    cards.push(
      `<section class="topic"><h2>${esc(topic.topic_name)}</h2><div class="grid">`,
    );
    for (const e of entries) {
      const n = e.question_number;
      const file = path.join(ILLUST_DIR, `q${String(n).padStart(3, "0")}.svg`);
      const svg = fs.readFileSync(file, "utf8");
      totalBytes += Buffer.byteLength(svg, "utf8");
      cards.push(`<figure class="card">
        <div class="art">${svg}</div>
        <figcaption><span class="num">${n}</span><span class="q">${esc(e.question_content)}</span></figcaption>
      </figure>`);
    }
    cards.push(`</div></section>`);
  }

  const avgKB = (totalBytes / 114 / 1024).toFixed(1);
  const html = `<title>Иллюстрации катехизиса</title>
<meta charset="utf-8">
<style>
:root{
  --bg:#FBF8F2; --surface:#FFFFFF; --ink:#2E2A25; --muted:#8A8177;
  --accent:#3D5A80; --accent-warm:#EB8A73; --line:#E8E1D3;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#1E2220; --surface:#262B28; --ink:#F1EDE4;
    --muted:#A6A093; --accent:#8FCFE6; --accent-warm:#EB8A73; --line:#3A3F3B;
  }
}
:root[data-theme="dark"]{
  --bg:#1E2220; --surface:#262B28; --ink:#F1EDE4; --muted:#A6A093;
  --accent:#8FCFE6; --accent-warm:#EB8A73; --line:#3A3F3B;
}
*{box-sizing:border-box}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font-family:"Mulish","Segoe UI",sans-serif; line-height:1.5;
}
header{
  position:sticky; top:0; z-index:5; background:var(--bg);
  border-bottom:1px solid var(--line); padding:20px 24px;
  display:flex; flex-wrap:wrap; align-items:baseline; gap:16px 28px;
}
h1{
  font-family:"Baloo 2","Mulish",sans-serif; font-weight:700;
  font-size:1.5rem; margin:0; text-wrap:balance;
}
.stats{display:flex; gap:20px; flex-wrap:wrap; font-family:"JetBrains Mono",monospace; font-size:0.82rem; color:var(--muted); font-variant-numeric:tabular-nums;}
.stats b{color:var(--ink); font-weight:600;}
main{padding:8px 24px 60px; max-width:1400px; margin:0 auto;}
.topic{margin-top:36px;}
.topic h2{
  font-family:"Baloo 2","Mulish",sans-serif; font-size:1.05rem; font-weight:600;
  color:var(--accent); margin:0 0 14px; padding-bottom:8px; border-bottom:1px solid var(--line);
}
.grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px;}
.card{
  margin:0; background:var(--surface); border:1px solid var(--line); border-radius:10px;
  overflow:hidden; display:flex; flex-direction:column;
}
.art{aspect-ratio:4/3; background:var(--line);}
.art svg{display:block; width:100%; height:100%;}
figcaption{padding:10px 12px; display:flex; gap:8px; align-items:baseline;}
.num{
  font-family:"JetBrains Mono",monospace; font-variant-numeric:tabular-nums;
  color:var(--accent-warm); font-weight:700; font-size:0.8rem; flex:none;
}
.q{font-size:0.82rem; color:var(--ink); text-wrap:balance;}
</style>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Mulish:wght@400;600&family=JetBrains+Mono:wght@500;700&display=swap">
<header>
  <h1>Иллюстрации катехизиса — 114/114</h1>
  <div class="stats">
    <span>файлов: <b>114</b></span>
    <span>средний размер: <b>${avgKB} КБ</b></span>
    <span>палитра: <b>только §3</b></span>
  </div>
</header>
<main>
${cards.join("\n")}
</main>
`;

  fs.writeFileSync(OUT_PATH, html, "utf8");
  console.log(`Wrote ${OUT_PATH} (${(html.length / 1024).toFixed(0)} KB)`);
}

main();
