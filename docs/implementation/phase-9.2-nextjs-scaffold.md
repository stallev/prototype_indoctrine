# Фаза 9.2 — Скелет Next.js

**Статус фазы:** todo

Связанные документы: [`README.md`](README.md) · [`../specs/nextjs-migration-spec.md`](../specs/nextjs-migration-spec.md) §2, §5, §7 · [`../specs/static-prototype-spec.md`](../specs/static-prototype-spec.md) §5.1 (палитра) · [`../../images/illustrations.node.ts`](../../images/illustrations.node.ts) (исходная логика для порта)

Зависит от Фазы 9.1 (нужен `content/index.ts` для страниц, но не для самого скелета/палитры — можно начинать параллельно, если 9.1 не завершена).

---

### 9.2.1 — Инициализировать Next.js 16.3.0 App Router + TypeScript + Tailwind v4

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** `npm run build` и `npm run dev` завершаются без ошибок; `package.json` фиксирует `"next": "16.3.0"` (без `^`); Tailwind v4 подключён (`@tailwindcss/cli` или `@tailwindcss/postcss` — по текущей практике Next 16). **`package.json` содержит три отдельных скрипта — `build` (`next build`), `typecheck` (`tsc --noEmit`), `lint` (`next lint` или `eslint .`) — все три выполняются без ошибок.** Начиная с этой задачи все последующие задачи и фазовый контроль (`multi-agent-workflow.md` §4, §5а) используют именно эти три команды.
- **Описание:** Базовый скелет — `app/layout.tsx`, `app/globals.css`, конфигурация TS, `tsconfig.json`, ESLint-конфиг (`eslint-config-next`, зафиксированный на 16.3.0 — см. `coding-conventions.md` §2). См. `coding-conventions.md` §2 для базовых правил App Router (Server Components по умолчанию, async request APIs, Turbopack).
- **Конвенции:** [`../conventions/data-routing-security.md`](../conventions/data-routing-security.md) §3 (тонкие страницы, `error.tsx` на сегментах, `loading.tsx` не требуется).
- **Заметки агентов:** —

### 9.2.2 — Подключить shadcn/ui и перенести Material-палитру

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** браузерный тест (`quality-checker`, см. `../multi-agent-workflow.md` §4) — отрендеренная страница использует цвета из `--md-sys-color-*` (см. `static-prototype-spec.md` §5.1), не дефолтную тему shadcn.
- **Описание:** `npx shadcn init` + добавление примитивов `Sheet`, `Button`, `ScrollArea`. CSS-переменные Material-палитры переносятся в `app/globals.css` под Tailwind v4 `@theme`, значения — без изменений (`--md-sys-color-primary: #3d5a80` и т.д.). Дефолтные токены shadcn (`--background`, `--primary`) переопределяются поверх текущей палитры. Это UI-задача — обязательно браузерное тестирование по `multi-agent-workflow.md` §4, не только `npm run build`.
- **Конвенции:** [`../conventions/copy-icons-fidelity.md`](../conventions/copy-icons-fidelity.md) §3 (визуальное соответствие текущему прототипу — таблица «что переносить пиксель-в-пиксель» и workflow сверки) · [`../conventions/accessibility-and-motion.md`](../conventions/accessibility-and-motion.md) §3 (контраст AA на новой палитре).
- **Заметки агентов:** —

### 9.2.3 — Создать `lib/illustrations.ts`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** `npm run build` проходит; на известном существующем SVG (`public/illustrations/q001.svg`) возвращает инлайн-разметку через `sanitizeSvg`; на несуществующем файле/`illustration === null` возвращает `placeholderSvg()`.
- **Описание:** Порт [`images/illustrations.node.ts`](../../images/illustrations.node.ts) — `sanitizeSvg`, `placeholderSvg`, `resolveIllustration`, `missingIllustrations` без изменения поведения (вырезка `<script>`, `on*`, `javascript:`, `<foreignObject>` — см. `coding-conventions.md` §5). Помечен `'server-only'`. Использует `content/index.ts` вместо старого `utils/catechism.ts`.
- **Конвенции:** [`../conventions/data-routing-security.md`](../conventions/data-routing-security.md) §5 (XSS-дисциплина — единственное легитимное место для `dangerouslySetInnerHTML` в проекте).
- **Заметки агентов:** —

### 9.2.4 — Создать `components/illustration.tsx`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** браузерный тест — существующая SVG-иллюстрация инлайнится в разметку страницы; отсутствующая → плейсхолдер `#BFE3F0` (`viewBox="0 0 1200 900"`); `.png`/`.jpg`/`.webp` → `<img>`.
- **Описание:** Server Component, использует `lib/illustrations.ts` (9.2.3). Эта задача — UI-задача, требует браузерного тестирования по `multi-agent-workflow.md` §4, не только сборки.
- **Конвенции:** [`../conventions/components.md`](../conventions/components.md) §3, §5 (Server Component без `'use client'`, props/ранний return по состоянию svg/raster/placeholder) · [`../conventions/accessibility-and-motion.md`](../conventions/accessibility-and-motion.md) §2 (содержательный `alt`) · [`../conventions/copy-icons-fidelity.md`](../conventions/copy-icons-fidelity.md) §2 (иллюстрации — не «иконки», отдельные правила).
- **Заметки агентов:** —
