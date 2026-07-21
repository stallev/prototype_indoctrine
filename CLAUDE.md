# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

All phases (0–8) of `docs/implementation-checklist.md` are done and accepted: scaffold, HTML shell, routing/rendering, accessible mobile drawer, `prompts/illustration-prompts.ts` (114 entries), all 114 `public/illustrations/qNNN.svg` files (generated from a shared vector-primitive library for consistency, not hand-authored one-by-one — see git history on those paths for how), and the final acceptance pass (automated full-coverage route/data sweep in-browser, illustration-fallback regression test, doctrinal audit of every sensitive question per `specs/svg-illustration-spec.md` §7). There is no test suite — acceptance was verified via an in-browser scripted sweep, not an automated test file; if you add one, put it in a way that doesn't require a browser dependency the static prototype otherwise has none of. Check `docs/implementation-checklist.md` before assuming what's next; there is no committed roadmap past Phase 8.

## Avoid AI slop

This is a small, content-driven prototype (114 fixed questions) — not a product that needs to look "built out." Concretely, in this repo:

- No filler UI: no hero/marketing copy, no fake stats or trust badges, no decorative emoji, no sections that don't map to real data (`topics`/`questions`/`verses`). If a spec doesn't call for a UI element, don't add it.
- No premature abstraction: `js/catechism-browser.js` is a plain port of `utils/catechism.ts` — don't wrap it in generic "data layer" / "service" / "repository" classes it doesn't need. Match the existing helper-function style, not a framework-shaped rewrite.
- No unused code paths: don't scaffold options, config flags, or extensibility hooks for formats/features the specs don't ask for (e.g. don't genericize past the fixed 1200×900 SVG canvas, the four JSON arrays, or the three routes).
- No comment noise: don't restate what the code obviously does (see root style rules); only comment non-obvious constraints (the same bar the rest of this codebase already holds to — see e.g. the terse rationale comments in `utils/catechism.ts`).
- No default-AI visual tells: no purple/indigo gradients, no glow effects, no generic icon-font soup — stick to the fixed Material token palette in `docs/static-prototype-spec.md` §5.1 and the fixed illustration palette in `specs/svg-illustration-spec.md` §3.
- Keep scope to the current checklist phase — don't pull forward work from later phases (e.g. don't start generating SVGs while still on the routing phase) and don't leave a phase half-done with dead stubs.

## What this project is

A normalized dataset for Carine Mackenzie's children's catechism *«Моя первая книга вопросов и ответов»* (114 questions, 16 topics), with Bible quotes in the Russian Synodal translation, prepared for rendering as a web app (planned: static HTML prototype first, later Next.js/Astro, with a migration path to Postgres/Neon).

## Repository structure

| Path | Role |
|------|------|
| `data/catechism.json` | Single source of truth. Four arrays: `topics`, `questions`, `verses`, `question_verses`. |
| `utils/catechism.ts` | Zod schema, TypeScript types, validating loader, and render helpers (including illustration paths). Node/build-time only in principle, but has no `node:fs` import itself. |
| `images/illustrations.node.ts` | Illustration resolution at build time (`node:fs`) — **server/build only**, never import from client code. |
| `images/_placeholder.svg` | Canonical neutral placeholder (same viewBox/palette as generated code). |
| `specs/svg-illustration-spec.md` | Full spec for generating the 114 SVG illustrations (palette, doctrinal constraints, prompt template, checklist). |
| `docs/static-prototype-spec.md` | Architecture spec for the static HTML SPA prototype (not yet implemented). |
| `docs/svg-prompts-ts-spec.md` | Contract for the future `prompts/illustration-prompts.ts` file. |
| `docs/implementation-checklist.md` | Ordered checklist/commit plan for building the prototype — check this first. |
| `public/illustrations/` | Target location for `qNNN.svg`/`.png`/`.jpg`/`.webp` files (does not exist yet). |
| `prompts/illustration-prompts.ts` | Not created yet — 114-entry prompt array for SVG generation. |

## Data model

```
topics ──1:N──> questions ──M:N (question_verses)──> verses
```

- `topics` (16 rows): `topic_id`, `topic_name`.
- `questions` (114 rows): `id`, `question_number` (1–114), `question_content`, `answer`, `topic_id`, `illustration` (path relative to `public/`, e.g. `illustrations/q001.svg`, or `null`).
- `verses` (102 rows, deduplicated by reference — a verse cited by multiple questions, e.g. John 3:16, is stored once): `id`, `book`, `chapter`, `verses` (range string), `reference`, `text` (nullable — `null` means the book cites only a reference with no quoted text).
- `question_verses` (110 rows, junction table): `question_id`, `verse_id`, `position` (citation order within a question).

Non-obvious data rules (see `utils/catechism.ts` and root README for the full rationale):
- 11 questions (the commandments and the Lord's Prayer) have **zero** linked verses because the Scripture text *is* the answer — don't show an empty verse block, check `verses.length === 0`.
- 7 verses have `text: null` (reference-only citations in the source book) — render the reference without a blockquote.
- Quote text in JSON has outer guillemets (`« »`) stripped already; add them at render time. Nested `" "` quotes are preserved as-is.
- `utils/catechism.ts` validates referential integrity (`topic_id`, `question_id`, `verse_id`) via a Zod `superRefine` on import — a broken `data/catechism.json` fails the build, not runtime.

## Illustrations architecture

Storage: path lives in JSON (`questions[].illustration`), file lives on disk in `public/illustrations/`, never embedded in `catechism.json`.

- `.svg` → read from disk and inlined into markup (`images/illustrations.node.ts` → `resolveIllustration`), sanitized via `sanitizeSvg` (strips `<script>`, `on*` handlers, `javascript:` hrefs — SVGs are AI-generated, semi-trusted input).
- `.png`/`.jpg`/`.jpeg`/`.webp` → served as a public URL for `<img>`.
- Missing file or `illustration === null` → `placeholderSvg()` fallback (`viewBox="0 0 1200 900"`, `#BFE3F0` background) — this is the client-side equivalent of `images/_placeholder.svg`.
- `missingIllustrations()` in `images/illustrations.node.ts` reports question numbers with no path or no file on disk — the way to check illustration coverage.

Generating new SVGs must follow `specs/svg-illustration-spec.md`, which is the hard authority on:
- **Fixed palette** (specific hex values only — do not introduce new colors) and canvas (`viewBox="0 0 1200 900"`, flat vector style, no raster/blur/text-in-SVG).
- **Doctrinal constraints that override aesthetics**: never depict God the Father, Christ, or the Holy Spirit as a figure/face (use light, creation imagery, cross, empty tomb, crown as symbols instead); strict modesty rules for figures (women/girls: dress/skirt below the knee, long sleeves, no pants; men/boys: no bare torso); Adam and Eve always modestly clothed or shown from a distance; hell/death/judgment shown symbolically without fire-with-people, bodies, or blood. See the sensitive-questions table (§7 of that spec) for specific question-number guidance (e.g. Q41–42/91/111–112 = wrath/hell, Q108 = judgment, Q109–110 = death/resurrection).
- The AI-agent prompt template (§8) that `prompts/illustration-prompts.ts` (once built) will use to generate the `prompt` field per question.

## Planned architecture (not yet built)

Per `docs/static-prototype-spec.md`: a single-file `index.html` SPA (no framework), Tailwind v4 + CSS variables for Material-Design-like styling, hash-based routing (`#/`, `#/topic/:id`, `#/q/:n`), `fetch()`-loaded JSON, no client-side Zod validation. Key constraint: `js/catechism-browser.js` will be a **plain-JS port** of `utils/catechism.ts`'s helpers (no Zod, no JSON import at module scope — data is injected via `initCatechism(data)`), because the Zod/import-JSON version is Node/bundler-oriented and unsuitable for a bare browser script.

Follow `docs/implementation-checklist.md` for build order — phases 1–5 (scaffold, shell, data/routing, mobile drawer, illustration fallback) don't depend on any SVGs existing; the UI is fully functional with placeholders. Phases 6–7 (prompt file, actual SVG generation) come after.

## Commands

```
npm install          # tailwindcss v4 + @tailwindcss/cli (only devDependencies so far)
npm run build:css    # tailwindcss -i ./styles/input.css -o ./styles/app.css
npm run watch:css    # same, with --watch
npm run serve        # npx serve . (static file server — needed because the app uses fetch() for JSON, file:// won't work)
```

`.claude/launch.json` runs `serve` on port 3000 for browser-preview tooling.

There is no test suite. Validation of `data/catechism.json` happens implicitly by importing `utils/catechism.ts` (Zod parse throws on invalid data/broken references).
