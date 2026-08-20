# Конвенции: данные, роутинг и безопасность

Детализация §2 и §5 [`../coding-conventions.md`](../coding-conventions.md) — адаптировано из `data-server-actions-and-api.mdc`, `security-xss-csrf.mdc`, `app-router-streaming-loading.mdc` (базовая часть), `javascript-fundamentals.mdc` (асинхронные паттерны) — см. [`../ADRs/adr-001-cursor-rules-delivery.md`](../ADRs/adr-001-cursor-rules-delivery.md).

**Статус:** предложено (ожидает утверждения)

Связанные документы: [`../coding-conventions.md`](../coding-conventions.md) §2, §5 · [`../contracts/image-generator-api-contract.md`](../contracts/image-generator-api-contract.md) · [`../specs/image-generator-tool-spec.md`](../specs/image-generator-tool-spec.md)

---

## 1. Server Action vs Route Handler — решение уже принято

В проекте ровно один случай внешнего побочного эффекта — вызов Google API инструментом генерации изображений. Это однозначно случай **Route Handler**, не Server Action:

| Сценарий | Что выбрать |
|---|---|
| Форма → внутреннее обновление той же страницы (список/деталь) | Server Action *(в этом проекте такого нет — контент статичен)* |
| JSON/внешний API-вызов | **Route Handler** — так и реализован `app/api/image-generator/route.ts` |

Причина: Server Action при вызове с клиента триггерит повторный рендер Server Components текущей страницы — ненужное и неверное поведение для вызова внешнего API с результатом-изображением; Route Handler + `fetch()` на клиенте не тянет за собой этот побочный эффект.

## 2. Данные — не БД, а константы

- Логика доступа к данным (`content/index.ts`) не является DAL к базе — это синхронное чтение TS-констант. `'server-only'` явно нужен только там, где идёт чтение с диска (`lib/illustrations.ts`, `fs.readFileSync`) — не в `content/index.ts` самом по себе (там нет `node:fs`, можно импортировать и в Server, и в Client Components при необходимости, хотя основное использование — из Server Components).
- Нет параллельных независимых источников данных, которые нужно было бы оборачивать в `Promise.all`/`Promise.allSettled` — весь контент читается синхронно из `content/index.ts`.

## 3. Страницы — тонкая композиция

- `page.tsx` — `await params`, вызов хелперов `content/index.ts`, передача данных в presentational-компоненты. Тяжёлая логика — не в `page.tsx`, а в `components/`.
- `error.tsx` на уровне сегмента `app/q/[number]/` и `app/topic/[topicId]/` — на случай непредвиденной ошибки рендера (не для `notFound()` — это отдельный, штатный путь через `notFound()`).
- `loading.tsx`/`Suspense` **не требуются** для страниц контента — нет асинхронного чтения данных (`content/index.ts` синхронен), стриминг не даёт выигрыша. Единственное место, где действительно есть асинхронность — форма генератора изображений, и она уже клиентская (pending-состояние формы, не Suspense-граница страницы).

## 4. Асинхронный код — общая дисциплина

- Каждая цепочка промисов заканчивается `.catch()`/`try-catch` — не оставлять необработанные rejection'ы (актуально прежде всего для `fetch()` в форме генератора изображений и для вызова Google API в Route Handler).
- `.map()` с `async`-колбэком никогда не остаётся «fire-and-forget» (`arr.map(async x => …)` без ожидания результата) — использовать `for...of` для последовательной обработки или `await Promise.all(arr.map(fn))` для параллельной.
- `reduce()` — всегда с явным `initialValue`.
- Модули — именованные экспорты, не `import * as ns`, ESM во всём проекте.
- TypeScript — предпочитать `Pick`/`Omit`/`Partial` от `Question`/`Verse`/`Topic` (`content/index.ts`) вместо ручного дублирования почти идентичного интерфейса.

## 5. Безопасность — XSS

- React JSX экранирует строки по умолчанию — не использовать `dangerouslySetInnerHTML` без санитизации.
- **Единственное легитимное исключение в этом проекте** — инлайн SVG-иллюстраций через `lib/illustrations.ts` (порт `sanitizeSvg`), см. §5 `coding-conventions.md`. Больше нигде `dangerouslySetInnerHTML` не используется.
- Пользовательский ввод (промпт генератора изображений) никогда не рендерится как HTML — только как текст в контролируемом `<input>`/превью текста.

## 6. Безопасность — CSRF на Route Handler

`app/api/image-generator/route.ts` — это **Route Handler**, а не Server Action, поэтому автоматической проверки Origin от Next.js он не получает (в отличие от Server Actions, где такая проверка встроена):

- **Обязательно проверять заголовок `Origin`** запроса на соответствие ожидаемому origin приложения перед обработкой `POST` — отклонять запрос с несовпадающим/отсутствующим `Origin` (`403`).
- Это отдельная проверка от валидации содержимого `prompt` (§2 `image-generator-api-contract.md`) — обе нужны одновременно.

## 7. Секреты

- `GEMINI_API_KEY` — только в Route Handler, серверная сторона, см. `image-generator-api-contract.md` §4. Не логировать значение целиком даже в диагностических сообщениях об ошибке.

## 8. Синхронизация документации с кодом

Когда реализация вынужденно отклоняется от того, что написано в спеке/контракте (например, формат ответа API оказался иным, чем изначально предполагалось в `image-generator-api-contract.md` §2) — **в той же задаче** обновить соответствующий контракт/спеку, а не оставлять расхождение молча. При конфликте документов — порядок приоритета: `docs/contracts/` и `docs/specs/` (архитектура/контракт этой миграции) → `docs/coding-conventions.md`/`docs/conventions/` (как реализовывать) → `CLAUDE.md` (общие правила проекта) → `docs/specs/static-prototype-spec.md` (текущий прототип — подчинённый визуальный референс, см. `docs/conventions/copy-icons-fidelity.md`).
