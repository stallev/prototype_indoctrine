# Спецификация миграции на Next.js

Архитектурная спека перевода прототипа со статического `index.html`/vanilla JS на **Next.js 16.3.0 App Router + TypeScript + Tailwind v4 + shadcn/ui**, без потери данных. Прямой преемник [`static-prototype-spec.md`](static-prototype-spec.md) — описывает целевую архитектуру, а не текущую.

**Статус:** предложено (ожидает утверждения)

Связанные документы:

- [`static-prototype-spec.md`](static-prototype-spec.md) — текущий статический прототип (источник миграции, дом-стиль)
- [`../contracts/svg-prompts-ts-spec.md`](../contracts/svg-prompts-ts-spec.md) — контракт промптов иллюстраций (не меняется)
- [`../contracts/content-data-contract.md`](../contracts/content-data-contract.md) — формальный контракт `content/*.ts`
- [`../coding-conventions.md`](../coding-conventions.md) — конвенции реализации
- [`../multi-agent-workflow.md`](../multi-agent-workflow.md) — процесс исполнения миграции
- [`image-generator-tool-spec.md`](image-generator-tool-spec.md) — отдельный инструмент, не часть контента катехизиса
- [`../implementation/`](../implementation/) — задачи миграции со статусом выполнения (Фаза 9)

---

## 1. Цель и границы

### Цель

Перенести полностью принятый статический прототип (Фазы 0–8) на Next.js, сохранив весь контент (114 вопросов, 16 разделов, 102 стиха, 110 связей, 114 SVG-иллюстраций) 1:1 и весь функционал (роутинг, mobile drawer, fallback иллюстраций, a11y).

### Границы

| Входит | Не входит |
|---|---|
| Next.js 16.3.0 App Router, TypeScript | Prisma / любая БД |
| Контент в `content/*.ts` (типизированные константы) | Клиентская Zod-валидация в рантайме приложения (Zod остаётся только в одноразовом скрипте миграции) |
| shadcn/ui-примитивы поверх текущей Material-палитры | Дефолтная тема shadcn/UI-кит другого продукта |
| Реальные маршруты App Router (`/`, `/topic/[topicId]`, `/q/[number]`) | Хэш-роутинг (заменяется полностью) |
| Обычный Vercel-деплой (Node runtime) — нужен из-за API-роута инструмента изображений | `output: 'export'` (полностью статический экспорт невозможен из-за §8) |
| Отдельный инструмент генерации изображений (см. `image-generator-tool-spec.md`) | Любая связь этого инструмента с 114 вопросами катехизиса |

---

## 2. Целевая файловая структура

```
prototype_indoctrine/
├── app/
│   ├── layout.tsx                     # шрифт, глобальные стили, shell (app bar + drawer)
│   ├── page.tsx                       # редирект → /q/1
│   ├── topic/[topicId]/page.tsx       # список вопросов раздела
│   ├── q/[number]/page.tsx            # карточка вопроса
│   ├── tools/
│   │   └── image-generator/page.tsx   # UI инструмента генерации изображений (не часть навигации катехизиса)
│   └── api/
│       └── image-generator/route.ts   # Route Handler: вызов Google API, ключ только на сервере
├── content/
│   ├── topics.ts
│   ├── questions.ts
│   ├── verses.ts
│   ├── question-verses.ts
│   └── index.ts                       # порт хелперов utils/catechism.ts
├── components/
│   ├── ui/                            # сгенерированные примитивы shadcn (Sheet, Button, ScrollArea…)
│   ├── nav-drawer.tsx
│   ├── question-card.tsx
│   ├── verse-block.tsx
│   └── illustration.tsx               # Server Component — инлайн SVG / <img> для растра
├── lib/
│   ├── illustrations.ts               # 'server-only', порт images/illustrations.node.ts
│   └── utils.ts                       # cn() и т.п. — стандартный shadcn-хелпер
├── public/illustrations/              # 114 SVG без изменений
├── scripts/
│   └── migrate-json-to-ts.ts          # разовый генератор content/*.ts из data/catechism.json
├── data/catechism.json                # архивируется как источник истины/откат (см. §4)
└── utils/catechism.ts                 # архивируется как источник истины/откат (см. §4)
```

`app/tools/image-generator/` намеренно не связан ссылками с навигацией по темам/вопросам — это отдельный инструмент (см. `image-generator-tool-spec.md`).

---

## 3. Контент как TypeScript

Текущая модель данных (`topics` → `questions` → `verses` через `question_verses`, см. `utils/catechism.ts`) переносится без изменений структуры — меняется только источник (TS-константы вместо JSON+Zod-парсинга в рантайме).

| Файл | Содержимое |
|---|---|
| `content/topics.ts` | `export const topics = [...] as const` — 16 записей, `{ topic_id, topic_name }` |
| `content/questions.ts` | `export const questions = [...] as const` — 114 записей, `{ id, question_number, question_content, answer, topic_id, illustration }` |
| `content/verses.ts` | `export const verses = [...] as const` — 102 записи, `{ id, book, chapter, verses, reference, text }` |
| `content/question-verses.ts` | `export const questionVerses = [...] as const` — 110 записей, `{ question_id, verse_id, position }` |
| `content/index.ts` | Типы (`Topic`, `Question`, `Verse`, `QuestionVerse` — выведены из констант через `typeof`), индексы (`verseById`), хелперы: `questionsForTopic`, `versesForQuestion`, `getQuestionWithVerses`, `illustrationStem`/`illustrationPath`/`illustrationPublicUrl`, `getTopic`, `allTopics` — прямой порт одноимённых функций `utils/catechism.ts` |

Правила рендера контента (пустой список стихов у заповедей/«Отче наш», `text === null` → без blockquote, добавление `« »` при рендере) переносятся без изменений — см. §7.3 `static-prototype-spec.md`, логика идентична, меняется только источник данных.

Referential integrity (`topic_id`, `question_id`, `verse_id`) в рантайме приложения **не** перепроверяется — она гарантирована на этапе генерации (§4) той же Zod-схемой, что использовалась раньше.

---

## 4. Скрипт миграции `scripts/migrate-json-to-ts.ts`

Разовый (не часть рантайма приложения) Node-скрипт:

1. Читает `data/catechism.json`.
2. Валидирует через существующую `CatechismSchema` (`superRefine`-проверка ссылочной целостности) из `utils/catechism.ts` — построчно идентичная гарантия, что и сейчас.
3. Генерирует 4 файла `content/*.ts` — сериализация массивов в `as const` TS-литералы (не переписывание вручную).
4. Сверяет счётчики до/после: 16 тем, 114 вопросов, 102 стиха, 110 связей — несовпадение = ошибка скрипта, миграция не считается пройденной.
5. Выводит отчёт (какие файлы созданы, счётчики).

После подтверждённого прогона `data/catechism.json` и `utils/catechism.ts` **не удаляются** — архивируются как источник истины/откат до финальной приёмки нового стека (аналог текущего Фазы-8 acceptance sweep, но на новом стеке — см. `implementation-checklist.md` Фаза 9).

---

## 5. Иллюстрации

Логика [`images/illustrations.node.ts`](../../images/illustrations.node.ts) переносится в `lib/illustrations.ts` как серверный хелпер (`'server-only'`, `fs.readFileSync`), используемый компонентом `components/illustration.tsx` (Server Component):

- `.svg` → читается с диска, санитизируется (`sanitizeSvg` — без изменений: вырезка `<script>`, `on*`, `javascript:`, `<foreignObject>`), инлайнится.
- `.png`/`.jpg`/`.jpeg`/`.webp` → публичный URL для `<img>`/`next/image`.
- Отсутствующий файл или `illustration === null` → `placeholderSvg()` — тот же нейтральный плейсхолдер (`viewBox="0 0 1200 900"`, `#BFE3F0`).
- `missingIllustrations()` переносится как есть — способ проверки покрытия.

Next.js Server Components дают эту функциональность "бесплатно" на этапе рендера/сборки — `onerror`-fallback из браузерной версии (§8.2 `static-prototype-spec.md`) не нужен, т.к. существование файла проверяется на сервере до отправки клиенту.

---

## 6. Роутинг

App Router заменяет хэш-роутинг (`#/`, `#/topic/:id`, `#/q/:n`) на реальные маршруты:

| Маршрут (было) | Маршрут (стало) | Механизм |
|---|---|---|
| `#/` | `/` | `redirect('/q/1')` в `app/page.tsx` |
| `#/topic/:id` | `/topic/[topicId]` | `generateStaticParams` по всем 16 темам; неизвестный `topicId` → `notFound()` |
| `#/q/:n` | `/q/[number]` | `generateStaticParams` по всем 114 номерам; вне 1…114 → `notFound()` (аналог редиректа на `#/q/1`, но как 404, а не силовой редирект — соответствует обычной практике Next.js) |

Все 130 страниц (16+114) генерируются статически на сборке — при неизменном контенте между сборками ISR не нужен.

---

## 7. UI-примитивы

shadcn/ui используется только как источник примитивов (`Sheet` — под mobile drawer вместо самодельного focus-trap, `Button`, `ScrollArea`), **не** как готовая тема:

- CSS-переменные Material-палитры (`--md-sys-color-*`, см. §5.1 `static-prototype-spec.md`) переносятся в `app/globals.css` под Tailwind v4 `@theme` без изменений значений.
- Дефолтные токены shadcn (`--background`, `--primary` и т.д.) переопределяются поверх текущей палитры — не наоборот.
- `Sheet` закрывает большую часть a11y-требований drawer'а (focus trap, `aria-modal`) — но `aria-current` на активном пункте меню и `aria-expanded` на аккордеоне раздела реализуются явно, т.к. это специфика контента (темы → вопросы), не общая механика `Sheet`.
- Подробнее — [`coding-conventions.md`](../coding-conventions.md) §4.

---

## 8. Инструмент генерации изображений

Полная спека — [`image-generator-tool-spec.md`](image-generator-tool-spec.md). Кратко: `app/api/image-generator/route.ts` — единственный серверный (не статический) роут в приложении, отсюда требование обычного Node-деплоя на Vercel вместо `output: 'export'`. Страницы контента катехизиса при этом остаются полностью статически генерируемыми — наличие одного динамического роута не меняет способ рендера остальных 130 страниц.

---

## 9. Явно вне рамок этой фазы

- Prisma / любая БД — контент статичен в TS до отдельного решения о подключении БД.
- Аутентификация/роли — не требуются, инструмент генерации изображений не персонализирован.
- Хранение сгенерированных изображений (S3 и т.п.) — инструмент только отдаёт файл на скачивание клиенту.

---

## 10. Открытые вопросы

1. Конкретная модель Google (Gemini 2.5 Flash Image / Imagen) для инструмента генерации — фиксируется в `image-generator-tool-spec.md`, не блокирует эту спеку.
2. Момент удаления архивных `data/catechism.json`/`utils/catechism.ts` — по итогам финальной приёмки нового стека (отдельный пункт `implementation-checklist.md` Фаза 9, не решается сейчас).
