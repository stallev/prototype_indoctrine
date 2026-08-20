# Конвенции реализации (для агентов Claude Code)

Свод правил кодогенерации для миграции на Next.js. Заменяет `.cursor/rules/*.mdc` как оперативный источник конвенций — обоснование см. в [`adr-001-cursor-rules-delivery.md`](ADRs/adr-001-cursor-rules-delivery.md).

**Статус:** предложено (ожидает утверждения)

Связанные документы:

- [`nextjs-migration-spec.md`](specs/nextjs-migration-spec.md) — архитектура, которую эти конвенции обслуживают
- [`multi-agent-workflow.md`](multi-agent-workflow.md) — кто и как проверяет соблюдение этих правил
- [`adr-001-cursor-rules-delivery.md`](ADRs/adr-001-cursor-rules-delivery.md) — почему правила именно такие (adopt/reject по каждому исходному `.mdc`)
- [`../CLAUDE.md`](../CLAUDE.md) — общие правила проекта (антипаттерны "AI slop", стиль комментариев)

Происхождение: адаптировано из `docs/reference/ai_first_tmp/.cursor/rules/*.mdc` (шаблон Pulse) — только применимые правила, без Prisma/Auth.js/S3/monorepo/Design-Lab частей.

---

## 1. Область действия

Эти конвенции действуют для нового кода в `app/`, `content/`, `components/`, `lib/`, `scripts/` при миграции на Next.js. Правила из `CLAUDE.md` (антипаттерны "AI slop", отсутствие комментариев-пересказов, стиль строгого соответствия спекам) остаются в силе без изменений и не дублируются здесь.

Полная таблица adopt/reject по каждому файлу `.cursor/rules/*.mdc` — в [`adr-001-cursor-rules-delivery.md`](ADRs/adr-001-cursor-rules-delivery.md) §3–4. Здесь и в [`conventions/`](conventions/) (§9) — сами правила в переработанном, применимом к этому проекту виде — не пересказ названий исходных `.mdc`, а перенесённое содержание.

**Синхронизация с кодом (обязательно).** Когда реализация вынужденно расходится с тем, что написано в спеке/контракте/этих конвенциях — в **той же задаче** обновить соответствующий документ, а не оставлять расхождение молча (полная версия правила и порядок приоритета документов — [`conventions/data-routing-security.md`](conventions/data-routing-security.md) §8).

---

## 2. Next.js App Router

- **Next.js 16.3.0** — фиксированная версия (без плавающего `^16`), как и в референсе; так же фиксировать `eslint-config-next`.
- **Три отдельные npm-команды обязательны в `package.json`** с задачи 9.2.1: `build` (`next build`), `typecheck` (`tsc --noEmit`), `lint` (`next lint`/`eslint .`). После **каждой** фазы миграции все три прогоняются заново с нуля (не переиспользуется результат последней задачи) — это обязательная часть фазового контроля, см. [`multi-agent-workflow.md`](multi-agent-workflow.md) §5а, и обязательная часть Definition of Done каждой отдельной задачи — см. §4 того же документа.
- **Server Components по умолчанию.** `'use client'` — только там, где реально нужны хуки состояния или браузерные API (drawer, форма генератора изображений). Страницы вопросов/разделов — чистые Server Components.
- **Async Request APIs**: `await cookies()`, `await headers()`, `await params`, `await searchParams` — везде, где Next 16 их требует.
- **`generateStaticParams`** для `/topic/[topicId]` и `/q/[number]` — все 16+114 страниц генерируются статически на сборке, без БД и без ISR (контент неизменен между сборками).
- **Turbopack** — сборщик по умолчанию, дополнительная настройка не нужна.
- Продвинутые механизмы Next 16.3 (Cache Components, `partialPrefetching`, Instant Navigations, `proxy.ts`) — **сознательно не используются** в этой фазе: сайт полностью статичен по контенту, а единственный динамический роут (`/api/image-generator`) не участвует в навигации по контенту. Пересмотреть, если появится реальная динамика.
- Композиция страниц: тяжёлая часть (Server Component, данные) — родитель; интерактивность — маленький клиентский "лист" (например, кнопки prev/next или сама форма генератора), а не вся страница целиком помечена `'use client'`.
- **Route Handler, не Server Action** — для вызова внешнего Google API (`app/api/image-generator/route.ts`); Server Actions в проекте не используются (нет форм, мутирующих серверный рендер текущей страницы). Полное обоснование и дисциплина асинхронного кода — [`conventions/data-routing-security.md`](conventions/data-routing-security.md).
- `page.tsx` — тонкая композиция (`await params`, вызов `content/index.ts`, передача данных вниз); `error.tsx` на сегментах `/q/[number]` и `/topic/[topicId]` на непредвиденные ошибки. `loading.tsx`/`Suspense` не требуются — весь контент читается синхронно, асинхронность есть только в клиентской форме генератора изображений.

## 3. TypeScript и структура файлов

- Один компонент/модуль — один файл; не смешивать несколько несвязанных экспортов в одном файле. Целевой лимит — ≤140 строк на UI-компонент. Полные правила именования, структуры и Server/Client-границы — [`conventions/components.md`](conventions/components.md); хуки и состояние — [`conventions/hooks-and-state.md`](conventions/hooks-and-state.md).
- Именование: `PascalCase` для компонентов и их файлов (`QuestionCard.tsx`), `camelCase` для функций/хелперов, `kebab-case` для маршрутных сегментов Next.js (`app/tools/image-generator/`).
- `content/*.ts` — типизированные `as const` массивы, зеркалящие текущие 4 массива `catechism.json`; типы выводятся из данных, а не объявляются вручную заново (аналогично тому, как `utils/catechism.ts` сейчас выводит типы Zod-схемой).
- Не создавать generic "data layer" / "service" / "repository" классы поверх `content/index.ts` — это прямой порт функций `utils/catechism.ts`, стиль сохраняется (см. `CLAUDE.md` §"No premature abstraction").
- Не заводить отдельный monorepo-пакет типов — проект однорепозиторный, общие типы живут в `content/index.ts` и `lib/`.
- Состояние — по умолчанию `useState`; Context/Zustand/Redux в проекте не нужны (нет cross-cutting клиентского состояния) — см. `conventions/hooks-and-state.md` §1.
- DRY: искать существующий хелпер/компонент перед тем, как писать новый; извлекать в shared только при повторе на 2+ местах; не устраивать репозиторный рефакторинг «заодно» с текущей задачей — см. `conventions/components.md` §6.

## 4. UI и shadcn/ui

- shadcn/ui используется как источник **примитивов** (`Sheet`, `Button`, `ScrollArea` и т.п.), не как готовая тема.
- **Единственная авторитетная палитра** — CSS-переменные Material-подобных токенов из [`static-prototype-spec.md`](specs/static-prototype-spec.md) §5.1 (`--md-sys-color-primary: #3d5a80` и т.д.). Дефолтная тема shadcn (в т.ч. любые "warm/forest"-подобные пресеты из референс-проекта — они принадлежат другому продукту) не используется и не копируется.
- Иконки — `lucide-react` (стандартный набор shadcn), без стороннего icon-font/emoji; не путать с 114 SVG-иллюстрациями вопросов — правила иконок и полная версия ниже: [`conventions/copy-icons-fidelity.md`](conventions/copy-icons-fidelity.md) §2.
- Mobile-first: базовые стили — для ≤640px, `md`(≥768px) — постоянный drawer. Правила брейкпоинтов и touch-целей (§4 `specs/static-prototype-spec.md`) переносятся без изменений.
- A11y: **полный стандарт (WCAG 2.1 AA, семантика, чек-лист) — [`conventions/accessibility-and-motion.md`](conventions/accessibility-and-motion.md)**, не только drawer. `Sheet` от shadcn/Radix закрывает focus trap/`aria-modal` "бесплатно"; явно доверять, но проверять браузерным тестированием (см. [`multi-agent-workflow.md`](multi-agent-workflow.md) §4) — библиотека не освобождает от проверки `aria-current`, `aria-expanded` на пунктах меню.
- Анимация — только `transform`/`opacity`, `prefers-reduced-motion` — см. `conventions/accessibility-and-motion.md` §6.
- Копирайтинг интерфейса — на русском, в тоне текущего прототипа (без маркетинговых формулировок, см. "Avoid AI slop" в `CLAUDE.md`); UI-строки (не контент вопросов) — централизованно в `lib/messages.ts`, см. `conventions/copy-icons-fidelity.md` §1.
- Соответствие визуальному прототипу (`docs/specs/static-prototype-spec.md`) обязательно — новый UI не "переизобретает" вид приложения, а переносит его на новый стек. Конкретный workflow сверки — [`conventions/copy-icons-fidelity.md`](conventions/copy-icons-fidelity.md) §3.

## 5. Безопасность

- SVG-иллюстрации остаются полудоверенным (AI-сгенерированным) входом — порт `sanitizeSvg` из [`images/illustrations.node.ts`](../images/illustrations.node.ts) переносится без ослабления (вырезка `<script>`, `on*`, `javascript:`, `<foreignObject>`).
- Секреты (`GEMINI_API_KEY`, уже в `.env`) — только в переменных окружения сервера, читаются исключительно в Route Handler (`app/api/image-generator/route.ts`), никогда не попадают в клиентский бандл и не логируются. Не то имя, которое `@ai-sdk/google` ищет по умолчанию — провайдер создаётся явно с `apiKey: process.env.GEMINI_API_KEY` (см. `docs/contracts/image-generator-api-contract.md` §4).
- Единственный API-роут с внешним побочным эффектом (вызов Google API) — валидировать вход (длина/наличие промпта) перед вызовом; не проксировать произвольные заголовки/тело запроса без проверки.
- **CSRF на Route Handler** — `app/api/image-generator/route.ts` не получает автоматической проверки Origin (в отличие от Server Actions); проверять заголовок `Origin` явно перед обработкой `POST`. Полная версия — [`conventions/data-routing-security.md`](conventions/data-routing-security.md) §6.
- Экранирование текста из `content/*.ts` при рендере (по умолчанию в JSX это делает React; не использовать `dangerouslySetInnerHTML` нигде, кроме санитизированного SVG). Полная дисциплина XSS/асинхронного кода — `conventions/data-routing-security.md` §4–5.

## 6. Git и коммиты

- **Общее правило репозитория** — коммиты только по явному запросу пользователя (действующее глобальное правило Claude Code). Это правило действует для всей ручной работы в репозитории вне мультиагентного пайплайна Фазы 9.
- **Явное исключение — мультиагентный пайплайн Фазы 9** ([`multi-agent-workflow.md`](multi-agent-workflow.md) §5а, §9). Пользователь явно авторизовал (2026-08-21) автоматический коммит **раз в фазу**, сразу после того, как фазовый контроль (`quality-checker` + `code-reviewer` над всей фазой целиком) проходит успешно, с автопереходом к следующей фазе без подтверждения. Исключение узкое и не переносится на любую другую автоматизацию в этом репозитории — вне этого конкретного пайплайна действует обычное правило "только по запросу".
- **`git push` не входит в исключение ни при каких условиях.** Пайплайн никогда не выполняет `push` — пользователь делает это сам, когда сочтёт нужным.
- Формат сообщений коммитов — обычный conventional-стиль (`type(scope): subject`), без обязательного префикса имени ветки (в отличие от референс-шаблона — там это требование monorepo-конвейера, здесь не нужно). Для коммитов пайплайна `scope` = id фазы (например `phase-9.1`), тело коммита перечисляет завершённые задачи.

## 7. Ревью кода

Кто и как проверяет соблюдение этих конвенций — не дублируется здесь; см. [`multi-agent-workflow.md`](multi-agent-workflow.md) (роли `quality-checker` и `code-reviewer`, `.claude/agents/code-reviewer.md`).

## 8. Отклонённые практики Pulse-шаблона

Кратко — что и почему не переносится (полная таблица — в ADR):

| Практика Pulse-шаблона | Почему не переносим |
|---|---|
| Prisma v7 + Neon Postgres, DAL/`packages/domain` | Явно нет БД в этой фазе (по решению пользователя) |
| Auth.js v5, `proxy.ts` авторизация | В проекте нет пользователей/ролей/авторизации |
| AWS S3 presigned upload | Иллюстрации — файлы в репозитории, генератор изображений отдаёт файл на скачивание клиенту, не хранит |
| `apps/web` + `apps/workers` monorepo, policy-пакеты | Один репозиторий, один Next.js-проект |
| Design Lab (`/design-system`), "warm forest" shadcn-тема | Своя палитра уже задана в `specs/static-prototype-spec.md` §5.1 |
| commitlint/husky, префикс ветки в коммите | Коммиты — только по запросу пользователя, без автоматизированного конвейера коммитов |

## 9. Детальные конвенции по темам

Разделы 1–8 выше — свод верхнего уровня. Полное содержание, перенесённое и адаптированное из соответствующих `.cursor/rules/*.mdc` (см. ADR-001 §3), — в [`conventions/`](conventions/):

| Файл | Тема | Из какого `.mdc` |
|---|---|---|
| [`conventions/components.md`](conventions/components.md) | Один компонент/файл, именование, Server/Client-граница, логика↔презентация, DRY | `react-one-component-per-file`, `react-naming-conventions`, `react-logic-presentation`, `ai-dry-deduplication` |
| [`conventions/hooks-and-state.md`](conventions/hooks-and-state.md) | Hooks discipline, решающее правило для состояния, SSR-безопасность | `react-ui-components` (§Hooks), `react-state-management` |
| [`conventions/accessibility-and-motion.md`](conventions/accessibility-and-motion.md) | WCAG 2.1 AA, семантика, чек-лист a11y, анимация/производительность рендера | `ui-semantics-a11y`, `ui-animation-performance` |
| [`conventions/data-routing-security.md`](conventions/data-routing-security.md) | Route Handler vs Server Action, тонкие страницы, асинхронный код, XSS/CSRF | `data-server-actions-and-api`, `security-xss-csrf`, `app-router-streaming-loading`, `javascript-fundamentals` |
| [`conventions/copy-icons-fidelity.md`](conventions/copy-icons-fidelity.md) | Копирайтинг UI-строк, иконки Lucide, визуальное соответствие текущему прототипу | `ui-messages-and-copy` (без i18n), `ui-icons-lucide`, `ui-prototype-fidelity` |

Задачи в [`implementation/phase-9.*.md`](implementation/) ссылаются на конкретный файл(ы) из этой таблицы там, где задача затрагивает соответствующую тему — не только на этот документ целиком.
