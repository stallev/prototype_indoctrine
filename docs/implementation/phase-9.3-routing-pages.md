# Фаза 9.3 — Роутинг и страницы

**Статус фазы:** todo

Связанные документы: [`README.md`](README.md) · [`../specs/nextjs-migration-spec.md`](../specs/nextjs-migration-spec.md) §6–7 · [`../specs/static-prototype-spec.md`](../specs/static-prototype-spec.md) §4, §6–7 (мобильное меню, правила рендера) · [`../contracts/content-data-contract.md`](../contracts/content-data-contract.md)

Зависит от Фазы 9.1 (`content/index.ts`) и Фазы 9.2 (`components/illustration.tsx`, палитра/shadcn).

---

### 9.3.1 — `app/page.tsx` (редирект на `/q/1`)

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** браузерный тест — переход на `/` завершается на `/q/1` (`redirect('/q/1')`).
- **Описание:** Минимальная замена текущего `#/` → `#/q/1` редиректа (см. `static-prototype-spec.md` §3.1) на серверный `redirect()` Next.js.
- **Конвенции:** [`../conventions/data-routing-security.md`](../conventions/data-routing-security.md) §3 (тонкая страница).
- **Заметки агентов:** —

### 9.3.2 — `app/q/[number]/page.tsx` + `generateStaticParams`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** `npm run build` статически генерирует 114 страниц (`/q/1`…`/q/114`); браузерный тест — `/q/1` и `/q/114` рендерят вопрос/ответ/раздел/иллюстрацию/стихи (или их отсутствие) по правилам §7.3 `static-prototype-spec.md` и `content-data-contract.md` §3; номер вне 1…114 → `notFound()`.
- **Описание:** Server Component: заголовок (`{question_number}. {question_content}`), ответ, иллюстрация (`components/illustration.tsx`), список стихов (пропускается при `verses.length === 0`, `text === null` → без blockquote), навигация prev/next, ссылка «К разделу». UI-задача — обязательно браузерное тестирование.
- **Конвенции:** [`../conventions/components.md`](../conventions/components.md) §1, §4 (лимит ≤140 строк — вынести карточку вопроса/блок стиха в отдельные presentational-компоненты, не всё в `page.tsx`) · [`../conventions/accessibility-and-motion.md`](../conventions/accessibility-and-motion.md) §2 (один `<h1>` на страницу, иерархия заголовков) · [`../conventions/copy-icons-fidelity.md`](../conventions/copy-icons-fidelity.md) §3 (структура/порядок блоков — как в прототипе).
- **Заметки агентов:** —

### 9.3.3 — `app/topic/[topicId]/page.tsx` + `generateStaticParams`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** `npm run build` статически генерирует 16 страниц; браузерный тест — список вопросов раздела отсортирован по `question_number`, совпадает с `content/questions.ts`; неизвестный `topicId` → `notFound()`.
- **Описание:** Server Component, использует `questionsForTopic` из `content/index.ts`. UI-задача — браузерное тестирование обязательно.
- **Конвенции:** [`../conventions/components.md`](../conventions/components.md) §6 (переиспользовать `question-card`/list-item компоненты из 9.3.2, не дублировать разметку) · [`../conventions/accessibility-and-motion.md`](../conventions/accessibility-and-motion.md) §2 (список — `<ul>`/`<li>`, не голые `<div>`).
- **Заметки агентов:** —

### 9.3.4 — `components/nav-drawer.tsx` на базе shadcn `Sheet`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** браузерный тест на `mobile`-пресете — гамбургер открывает/закрывает drawer, overlay, Escape, focus trap, `aria-expanded`/`aria-controls`/`aria-current` на активном пункте; на `desktop`-пресете — drawer постоянный, без overlay и гамбургера (см. `static-prototype-spec.md` §6).
- **Описание:** `Sheet` закрывает focus trap/`aria-modal` "бесплатно" — но `aria-current` на активном пункте и раскрытие раздела (topic → questions) реализуются явно. Список разделов/вопросов — из `allTopics()`/`questionsForTopic()`. Явно UI-задача повышенного внимания к a11y — браузерное тестирование по `multi-agent-workflow.md` §4 обязательно на обоих пресетах.
- **Конвенции:** [`../conventions/accessibility-and-motion.md`](../conventions/accessibility-and-motion.md) §2–5 (полный чек-лист — эта задача самая a11y-чувствительная в проекте) · [`../conventions/hooks-and-state.md`](../conventions/hooks-and-state.md) §1–2 (открытие/закрытие — `useState`, `'use client'` только на самом drawer, не на всей странице) · [`../conventions/copy-icons-fidelity.md`](../conventions/copy-icons-fidelity.md) §2 (гамбургер/закрытие — `lucide-react`, `aria-label`).
- **Заметки агентов:** —
