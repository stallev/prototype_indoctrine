# Конвенции: компоненты, файлы, структура

Детализация §3 [`../coding-conventions.md`](../coding-conventions.md) — адаптировано из `react-one-component-per-file.mdc`, `react-naming-conventions.mdc`, `react-logic-presentation.mdc`, `ai-dry-deduplication.mdc` (см. [`../ADRs/adr-001-cursor-rules-delivery.md`](../ADRs/adr-001-cursor-rules-delivery.md)).

**Статус:** предложено (ожидает утверждения)

Связанные документы: [`../coding-conventions.md`](../coding-conventions.md) §3 · [`hooks-and-state.md`](hooks-and-state.md) · [`../specs/nextjs-migration-spec.md`](../specs/nextjs-migration-spec.md) §2

---

## 1. Один компонент — один файл

- В `*.tsx` с UI-компонентом — **ровно один** именованный экспорт React-компонента. `default export` — только в `page.tsx`/`layout.tsx`.
- Подкомпоненты — соседние файлы через `import`, не вложенные функции внутри одного файла.
- Исключения: чистые константы/хелперы/типы без второго компонента; `index.ts` только с реэкспортом.
- **Целевой лимит: ≤ 140 строк** на компонент (JSX). Превышение — разбить на соседние presentational-модули (§3 ниже). Исключения: `page.tsx`/`layout.tsx` (тонкая композиция), сгенерированные `components/ui/*` (shadcn upstream).

## 2. Именование

| Что | Стиль | Пример |
|---|---|---|
| React-компонент | `PascalCase`, файл = имя компонента | `QuestionCard.tsx` экспортирует `QuestionCard` |
| Кастомный хук | `use` + `PascalCase` экспорт, `kebab-case` файл | `use-nav-drawer.ts` экспортирует `useNavDrawer` |
| Функция/переменная | `camelCase` | `questionNumber`, `isDrawerOpen` |
| Boolean | префикс `is`/`has`/`can`/`should` | `isDrawerOpen`, `hasVerses` |
| Обработчик события | `handle` + предметная область + событие | `handleDrawerClose`, `handlePromptSubmit` — не голый `handleClick` |
| Функция (не хук, не обработчик) | глагол + объект | `formatVerseReference`, `getTopicQuestions` — не `process`/`run`/`doAction` |
| Коллекция | множественное число | `questions`, `verses` |
| Модульная константа | `SCREAMING_SNAKE_CASE` | `ILLUSTRATION_DIR`, `MAX_PROMPT_LENGTH` |
| Маршрутный сегмент Next.js | `kebab-case` | `app/tools/image-generator/` |

Кастомный хук называть `use...` **только если** внутри реально вызывается React Hook — иначе обычная функция (`getSortedQuestions`, не `useSortedQuestions`).

**Антипаттерны** (не использовать): `data`/`item`/`temp`/`res`/`val`/`obj` для нетривиальных значений; `flag`/`check`/`status`/`info` без предметной области; `handleClick`/`handleChange` без контекста; `process`/`run`/`doAction`/`getList` без объекта действия; смешение `snake_case` и `camelCase` в одном TS/React-модуле.

## 3. Server/Client-граница

- **Server Components по умолчанию** — без `'use client'`.
- `'use client'` — только для хуков, DOM-событий, браузерных API; директива в начале файла.
- **Извлекать интерактивный "лист"** — одна интерактивная деталь не оправдывает `'use client'` на всей странице (пример: кнопки prev/next или форма генератора изображений — маленький клиентский компонент, страница вокруг остаётся Server Component).
- Данные вычисляются/читаются на сервере (из `content/index.ts` — не запрос, а синхронный доступ к константам) и передаются вниз как props — не дублировать чтение на клиенте через `useEffect`.

## 4. Логика ↔ презентация

Не смешивать чтение данных/бизнес-логику с интерактивным UI в одном модуле:

| Слой | Расположение в этом проекте | Ответственность |
|---|---|---|
| Данные | `content/index.ts`, `lib/illustrations.ts` (`'server-only'`) | Чтение констант/SVG-файлов, без UI |
| Server UI shell | `page.tsx`, серверные компоненты | Собрать данные, передать serializable props |
| Client-интерактивность | `*.client.tsx` (drawer-toggle, форма генератора) | `useState`/события; **без** чтения данных напрямую |
| Presentational | `question-card.tsx`, `verse-block.tsx`, `illustration.tsx` | Props → JSX; без чтения `content/*` и без клиентского состояния |

Запрещено: один компонент одновременно читает данные из `content/index.ts` **и** содержит клиентский интерактив (`useState`/события) — разделить на server-обёртку + presentational/client детей.

## 5. Компоненты: базовые правила

- Явные `interface`/`type` для props; без `React.FC`.
- Компоненты — стрелочные функции (`const X = (props: Props) => …`), кроме `page.tsx`/`layout.tsx`.
- Деструктуризация props со значениями по умолчанию в сигнатуре.
- Ранний `return` на каждое состояние UI (loading/error/empty/success) — не вложенные тернарники.
- Стабильный `key` (`question_number`/`id`), не индекс массива и не `Math.random()`.

## 6. Переиспользование и DRY

1. **Искать перед тем, как писать** — проверить `components/` на существующий подходящий компонент/хелпер, прежде чем добавлять новый.
2. Повтор одного и того же блока на 2+ маршрутах → вынести в `components/` как shared, именованный экспорт.
3. **SRP** — один модуль/компонент = одна ответственность (либо чтение данных, либо форма, либо презентация — не всё сразу).
4. **OCP** — варианты поведения через props, не копипаста веток (например, drawer mobile/desktop — через проп/брейкпоинт, не два похожих компонента).
5. **DIP** — presentational-компоненты зависят от типов `content/index.ts` (`Question`, `Verse`), не от сырой структуры `data/catechism.json`.
6. Область применения DRY — только код, который реально редактируется в текущей задаче; не затевать репозиторный рефакторинг «заодно».
