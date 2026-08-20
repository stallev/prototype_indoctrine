// Generates public/illustrations/qNNN.svg for all 114 questions from
// scripts/illustration-scenes.cjs, using the shared primitive kit in
// scripts/svg-lib.cjs. Validates each output against the hard rules in
// specs/svg-illustration-spec.md §4/§9 (palette-only colors, no
// <script>/<image>/<text>/external refs, has <title>, viewBox, node/size
// budget) before writing.
//
// Usage: node scripts/generate-illustrations.cjs

const fs = require("node:fs");
const path = require("node:path");

const L = require("./svg-lib.cjs");
const { scenes } = require("./illustration-scenes.cjs");

const PROMPTS_TS = path.join(__dirname, "..", "prompts", "illustration-prompts.ts");
const OUT_DIR = path.join(__dirname, "..", "public", "illustrations");

const ALLOWED_HEX = new Set(Object.values(L.PALETTE).map((h) => h.toUpperCase()));
const NODE_RE = /<(path|rect|circle|ellipse|polygon|polyline|line|g|linearGradient|radialGradient|stop)\b/g;
const HEX_RE = /#[0-9A-Fa-f]{6}\b/g;

function validate(n, svg) {
  const errors = [];

  if (!/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 1200 900"/.test(svg)) {
    errors.push("missing/incorrect root <svg viewBox> opening");
  }
  if (!/<title>[^<]+<\/title>/.test(svg)) errors.push("missing <title>");
  if (/<text\b/i.test(svg)) errors.push("contains <text>");
  if (/<script\b/i.test(svg)) errors.push("contains <script>");
  if (/<image\b/i.test(svg)) errors.push("contains <image>");
  if (/<foreignObject\b/i.test(svg)) errors.push("contains <foreignObject>");
  if (/\son\w+\s*=/i.test(svg)) errors.push("contains event handler attribute");
  if (/href\s*=\s*"(?!#)/i.test(svg)) errors.push("contains external/non-fragment href");

  const hexes = svg.match(HEX_RE) || [];
  for (const hex of hexes) {
    if (!ALLOWED_HEX.has(hex.toUpperCase())) {
      errors.push(`off-palette color ${hex}`);
    }
  }

  const nodeCount = (svg.match(NODE_RE) || []).length;
  const bytes = Buffer.byteLength(svg, "utf8");

  return { errors, nodeCount, bytes };
}

function main() {
  const { illustrationPrompts } = require(PROMPTS_TS);
  const byNumber = new Map(illustrationPrompts.map((e) => [e.question_number, e]));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const report = [];
  let hardFailures = 0;

  for (let n = 1; n <= 114; n++) {
    const entry = byNumber.get(n);
    if (!entry) throw new Error(`No prompt entry for question_number ${n}`);

    const recipe = scenes(entry);
    const svg = L.render(recipe, `q${n}`);
    const { errors, nodeCount, bytes } = validate(n, svg);

    if (errors.length > 0) {
      hardFailures++;
      console.error(`q${String(n).padStart(3, "0")}: FAILED — ${errors.join("; ")}`);
      continue; // do not write invalid files
    }

    const fileName = `q${String(n).padStart(3, "0")}.svg`;
    fs.writeFileSync(path.join(OUT_DIR, fileName), svg, "utf8");

    const overBudget = nodeCount > 200 || bytes > 20 * 1024;
    report.push({ n, fileName, nodeCount, bytes, overBudget });
  }

  console.log(`\nWrote ${report.length}/114 files.`);
  if (hardFailures > 0) {
    console.error(`${hardFailures} file(s) FAILED validation and were NOT written.`);
  }

  const overBudget = report.filter((r) => r.overBudget);
  if (overBudget.length > 0) {
    console.log(`\n${overBudget.length} file(s) over the ~200 node / ~20KB budget (soft guideline):`);
    for (const r of overBudget) {
      console.log(`  ${r.fileName}: ${r.nodeCount} nodes, ${(r.bytes / 1024).toFixed(1)} KB`);
    }
  }

  const nodeCounts = report.map((r) => r.nodeCount);
  const byteCounts = report.map((r) => r.bytes);
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  console.log(
    `\nAverage: ${avg(nodeCounts).toFixed(0)} nodes, ${(avg(byteCounts) / 1024).toFixed(1)} KB. ` +
      `Range: ${Math.min(...nodeCounts)}–${Math.max(...nodeCounts)} nodes, ` +
      `${(Math.min(...byteCounts) / 1024).toFixed(1)}–${(Math.max(...byteCounts) / 1024).toFixed(1)} KB.`,
  );

  if (hardFailures > 0) process.exitCode = 1;
}

main();
