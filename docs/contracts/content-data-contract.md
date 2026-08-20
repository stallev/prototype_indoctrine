# Контракт данных `content/*.ts`

Формальный контракт целевой формы данных катехизиса после миграции из `data/catechism.json` в TypeScript-модули. Источник истины для [`scripts/migrate-json-to-ts.ts`](../implementation/phase-9.1-content-migration.md) и для приёмки Фазы 9.1.

**Статус:** предложено (ожидает утверждения)

Связанные документы:

- [`../specs/nextjs-migration-spec.md`](../specs/nextjs-migration-spec.md) §3–4 — где этот контракт используется
- [`../implementation/phase-9.1-content-migration.md`](../implementation/phase-9.1-content-migration.md) — задачи, реализующие этот контракт
- [`../../utils/catechism.ts`](../../utils/catechism.ts) — исходная Zod-схема и текущая реализация хелперов
- [`../../CLAUDE.md`](../../CLAUDE.md) §"Data model" — то же самое описание модели, для текущего (JSON) состояния

---

## 1. Область действия

Описывает форму 4 файлов `content/topics.ts`, `content/questions.ts`, `content/verses.ts`, `content/question-verses.ts` и экспортов `content/index.ts`. Не описывает UI-рендер (см. `nextjs-migration-spec.md` §6–7) и не описывает исходный `data/catechism.json` (см. `utils/catechism.ts` — контракт не меняется, только источник).

## 2. Типы

```ts
type Topic = {
  topic_id: number;      // положительное целое
  topic_name: string;    // непустая строка
};

type Question = {
  id: number;
  question_number: number;         // 1..114, без пропусков
  question_content: string;
  answer: string;
  topic_id: number;                // ссылается на существующий Topic.topic_id
  illustration: string | null;     // "illustrations/qNNN.svg|png|jpg|jpeg|webp" или null
};

type Verse = {
  id: number;
  book: string;
  chapter: number;
  verses: string;          // диапазон, напр. "27" или "27-28"
  reference: string;       // отображаемая ссылка, напр. "Псалом 101:27-28"
  text: string | null;     // Синодальный текст без внешних « », или null
};

type QuestionVerse = {
  question_id: number;     // ссылается на Question.question_number
  verse_id: number;        // ссылается на Verse.id
  position: number;        // порядок цитаты внутри вопроса, с 1
};
```

Типы выводятся из констант (`typeof topics[number]` и т.п.), не объявляются отдельно — идентично тому, как `utils/catechism.ts` сейчас выводит их Zod-схемой.

## 3. Инварианты (обязательные)

| Инвариант | Значение |
|---|---|
| Количество тем | ровно 16 |
| Количество вопросов | ровно 114, `question_number` 1…114 без пропусков и дублей |
| Количество стихов | ровно 102 (дедуплицированы по `reference`) |
| Количество связей вопрос↔стих | ровно 110 |
| Вопросы без стихов | ровно 11 (заповеди + «Отче наш») — `questionVerses.filter(l => l.question_id === n).length === 0` для этих номеров; UI не показывает пустой блок стихов |
| Стихи без текста | ровно 7 — `text === null`; UI показывает только `reference`, без blockquote |
| Кавычки в `text` | внешние `« »` **не** входят в значение — добавляются при рендере; вложенные `" "` сохраняются как есть |
| Ссылочная целостность | каждый `Question.topic_id` существует в `topics`; каждый `QuestionVerse.question_id`/`verse_id` существует в `questions`/`verses` |

Целостность гарантируется **один раз**, на этапе генерации (`scripts/migrate-json-to-ts.ts`, той же `CatechismSchema`/`superRefine`, что и сейчас в `utils/catechism.ts`) — рантайм приложения её повторно не проверяет.

## 4. Обязательные экспорты `content/index.ts`

| Экспорт | Сигнатура | Поведение |
|---|---|---|
| `questionsForTopic` | `(topicId: number) => Question[]` | Вопросы раздела, sort по `question_number` |
| `versesForQuestion` | `(questionNumber: number) => Verse[]` | Стихи вопроса, sort по `position` |
| `getQuestionWithVerses` | `(questionNumber: number) => (Question & { verses: Verse[] }) | undefined` | Вопрос + связанные стихи |
| `illustrationStem` | `(questionNumber: number) => string` | `q001`…`q114` |
| `illustrationPath` | `(questionNumber: number, ext?) => string` | `illustrations/qNNN.ext` |
| `illustrationPublicUrl` | `(relPath: string) => string` | Путь с ведущим `/` |
| `getTopic` | `(topicId: number) => Topic | undefined` | — |
| `allTopics` | `() => Topic[]` | — |

Сигнатуры и поведение идентичны одноимённым функциям [`utils/catechism.ts`](../../utils/catechism.ts) — это порт, не переосмысление.

## 5. Definition of Done для задач, реализующих этот контракт

- `npm run build` проходит (типы валидны).
- Скрипт-генератор подтверждает счётчики §3 в своём выводе.
- `content/index.ts` экспортирует все пункты §4 с указанными сигнатурами (проверяется `grep`/тайпчеком в `quality-checker`).
