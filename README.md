# Катехизис — данные для веб-приложения

Нормализованный набор данных детского катехизиса Кэрин Мак-Кензи «Моя первая книга вопросов и ответов» (114 вопросов, 16 разделов) с библейскими цитатами в **Синодальном переводе**. Подготовлен для рендеринга на веб-странице (Next.js / Astro) с заделом под миграцию в Postgres / Neon.

## Структура репозитория

| Путь | Роль |
|------|------|
| `data/catechism.json` | Данные — единый source of truth. Четыре массива: `topics`, `questions`, `verses`, `question_verses`. |
| `utils/catechism.ts` | Zod-схема, TypeScript-типы, валидирующий загрузчик и хелперы (включая пути к иллюстрациям). |
| `images/illustrations.node.ts` | Разрешение иллюстраций на сборке (`node:fs`) — только сервер, не в клиентский бандл. |
| `images/_placeholder.svg` | Эталон нейтрального плейсхолдера (тот же viewBox/палитра, что в коде). |
| `images/README.md` | Кратко про форматы и рендер иллюстраций. |
| `specs/svg-illustration-spec.md` | Спецификация генерации **SVG** (палитра, доктрина, промпт, чек-лист). Растр — см. README. |
| `docs/` | Документация статического HTML-прототипа и контракт файла промптов для SVG. |
| `public/illustrations/` | Файлы `qNNN.svg` / `.png` / `.jpg` / `.webp` (создаётся при генерации). |
| `prompts/illustration-prompts.ts` | Массив промптов для генерации SVG (ещё не создан; см. docs). |
| `README.md` | Этот файл. |

## Статический прототип

**Статус: спека готова, код ещё нет.**

Планируется однофайловый HTML SPA (Material UI-стиль через Tailwind v4 + CSS variables, mobile-first, адаптивное меню). Данные рендерятся из `data/catechism.json` по подходам `utils/catechism.ts`; при отсутствии файла иллюстрации — `images/_placeholder.svg`.

| Документ | Содержание |
|----------|------------|
| [`docs/static-prototype-spec.md`](docs/static-prototype-spec.md) | Архитектура, файлы, роутинг, Material/Tailwind, мобильное меню, рендер, placeholder |
| [`docs/svg-prompts-ts-spec.md`](docs/svg-prompts-ts-spec.md) | Требования к `prompts/illustration-prompts.ts` (114 промптов для SVG) |
| [`docs/implementation-checklist.md`](docs/implementation-checklist.md) | Пошаговый чек-лист реализации кода и генерации иллюстраций |

## Источник и права

- English original: © 2001 Carine Mackenzie, «My First Book of Questions and Answers», Christian Focus Publications (Scotland).
- Русский перевод: Руслан Горяинов, © Церковь «Преображение», Самара, 2009 (`www.propovedi.ru`). Материал для свободного распространения; продажа и публикация в иной форме — только с разрешения правообладателей.
- Библейские цитаты: Синодальный перевод.

## Модель данных

Данные нормализованы. Стихи вынесены в отдельную таблицу и дедуплицированы, связь «вопрос ↔ стих» — отдельная junction-таблица.

```
topics ──1:N──> questions ──M:N (question_verses)──> verses
```

### `topics` — разделы катехизиса (16)

| Поле | Тип | Описание |
|------|-----|----------|
| `topic_id` | number | Идентификатор раздела. |
| `topic_name` | string | Название раздела (напр. «Бог», «Сотворение»). |

### `questions` — вопросы и ответы (114)

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | number | Суррогатный идентификатор (сейчас совпадает с `question_number`). |
| `question_number` | number | Номер вопроса по книге (1–114). |
| `question_content` | string | Текст вопроса. |
| `answer` | string | Текст ответа, как в книге. У вопросов-заповедей и «Отче наш» ответ и есть текст Писания. |
| `topic_id` | number | Ссылка на `topics.topic_id`. |
| `illustration` | string \| null | Путь к файлу относительно `public/` (`illustrations/q001.svg` \| `.png` \| `.jpg` \| `.jpeg` \| `.webp`). **Не** бинарные/SVG-данные. `null` — путь ещё не задан. См. «Иллюстрации». |

### `verses` — уникальные библейские стихи (102)

Дедуплицированы по ссылке: один стих хранится один раз, даже если его цитируют несколько вопросов.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | number | Идентификатор стиха. |
| `book` | string | Книга Библии (напр. «Евангелие от Иоанна», «1-е Коринфянам»). |
| `chapter` | number | Глава. |
| `verses` | string | Диапазон стихов (напр. `"27"` или `"27-28"`). |
| `reference` | string | Отображаемая ссылка (напр. «Псалом 101:27-28»). |
| `text` | string \| null | Синодальный текст. `null`, когда в книге дана только ссылка без цитаты. |

### `question_verses` — связь вопрос ↔ стих (110)

| Поле | Тип | Описание |
|------|-----|----------|
| `question_id` | number | Ссылка на `questions.id`. |
| `verse_id` | number | Ссылка на `verses.id`. |
| `position` | number | Порядок цитаты внутри вопроса (1, 2, 3…). |

## Загрузка и валидация

`utils/catechism.ts` импортирует JSON и валидирует его схемой Zod при первом импорте модуля. Помимо проверки типов, `superRefine` проверяет ссылочную целостность: каждый `topic_id`, `question_id` и `verse_id` в связях должен существовать. Для статической сборки это выполняется на этапе билда — стоимость нулевая, но битый JSON после ручной правки уронит билд, а не прод.

Требования к `tsconfig.json` проекта: `resolveJsonModule: true`, `esModuleInterop: true`. Зависимость: `zod`.

### Экспортируемые данные и типы

```ts
import { topics, questions, verses, questionVerses } from './utils/catechism';
import type { Topic, Question, Verse, QuestionVerse } from './utils/catechism';
```

### Хелперы

```ts
// Стихи для вопроса, в порядке цитирования
versesForQuestion(questionNumber: number): Verse[]

// Вопросы раздела, отсортированные по номеру
questionsForTopic(topicId: number): Question[]

// Вопрос + связанные стихи одной структурой (удобно для страницы)
getQuestionWithVerses(questionNumber: number): QuestionWithVerses | undefined

// Пути к иллюстрациям (безопасно для клиента)
ILLUSTRATION_DIR                 // 'illustrations'
illustrationStem(n): string      // 'q001'
illustrationFileName(n, ext?)    // 'q001.svg' | 'q001.png' …
illustrationPath(n, ext?)        // 'illustrations/q001.svg'
illustrationKind(path)           // 'svg' | 'raster' | null
illustrationPublicUrl(path)      // '/illustrations/q001.png'
```

### Пример рендеринга

```tsx
const q = getQuestionWithVerses(58);
// q.question_content — вопрос
// q.answer           — ответ
// q.verses           — [Деяния 3:22, Евреям 5:6, Псалом 2:6]

return (
  <article>
    <h3>{q.question_number}. {q.question_content}</h3>
    <p>{q.answer}</p>
    {q.verses.length > 0 && (
      <ul>
        {q.verses.map((v) => (
          <li key={v.id}>
            {v.text ? <blockquote>«{v.text}»</blockquote> : null}
            <cite>{v.reference}</cite>
          </li>
        ))}
      </ul>
    )}
  </article>
);
```

## Проектные решения и особенности данных

- **11 вопросов без связанных стихов** (заповеди 67, 69, 71, 73, 77, 79, 81, 83, 85, 87 и «Отче наш» 105). У них Писание и есть ответ, поэтому текст лежит в `answer`, а не дублируется в `verses`. При рендере: если `verses.length === 0` — не показывать блок стихов.
- **7 стихов с `text: null`** (Бытие 1:1-31; Луки 2:4-7; Исход 20:3-17, 20:3-11, 20:12-17; Псалом 81:3-4; 1 Кор 11:24-25) — в книге дана только ссылка. Рендерить как ссылку без блока текста.
- **7 стихов переиспользуются** несколькими вопросами (напр. Иоанна 3:16 — вопросы 43 и 93; Евреям 4:15 — 49 и 90). Благодаря junction-таблице их текст хранится один раз.
- **Нормализация текста цитат:** сняты внешние кавычки-ёлочки `« »` (добавляйте при рендере), вложенные `“ ”` сохранены. В Мф 5:21-22 убраны пояснительные вставки книги (`[пустой человек]`, `[верховное судилище]`) как не относящиеся к Синодальному тексту; стандартные синодальные вставки в квадратных скобках (напр. `[вашим]`) сохранены.
- **Исправлена ошибка ссылки из оригинала:** вопрос 46 — было «Евангелие от Луки 3:31», исправлено на «Евангелие от Луки 1:30-31» (там находится процитированный текст).

## Иллюстрации

Схема: **путь в JSON → файл на диске → рендер по формату** (файл не вшивается в `catechism.json`).

| Формат | Расширения | Рендер |
|--------|------------|--------|
| Вектор | `.svg` | Инлайн разметки на сборке (`sanitizeSvg`) |
| Растр | `.png`, `.jpg` / `.jpeg`, `.webp` | `<img src="/illustrations/qNNN.png">` или `next/image` |

| Что | Где |
|-----|-----|
| Файл | `public/illustrations/qNNN.<ext>` (`q001` … `q114`) |
| Путь в данных | `questions[].illustration` = `"illustrations/qNNN.<ext>"` (или `null`) |
| Правила для SVG | `specs/svg-illustration-spec.md` (палитра, viewBox `0 0 1200 900`, доктрина, чек-лист §9) |
| Доктрина для растра | те же жёсткие ограничения спеки §2 / §7 (без изображения Божества, модесть, без страха); технические правила SVG не применяются |
| Краткая памятка | `images/README.md` |

Модули:

- `utils/catechism.ts` — хелперы путей и формата (безопасны для клиента).
- `images/illustrations.node.ts` — **только сервер/сборка**:
  - `resolveIllustration(n)` → `{ kind: 'svg', markup }` \| `{ kind: 'raster', src, path }` \| `{ kind: 'placeholder', markup }`
  - `inlineSvg(n)` — только SVG/плейсхолдер (для растра вернёт плейсхолдер; лучше `resolveIllustration`)
  - `sanitizeSvg` — XSS для инлайн-SVG (**не** замена чек-листа спеки)
  - `missingIllustrations()` — нет пути или файла на диске

Пример на сборке:

```tsx
import { resolveIllustration } from './images/illustrations.node';

const ill = resolveIllustration(q.question_number);

if (ill.kind === 'raster') {
  return <img src={ill.src} alt="" width={1200} height={900} />;
}
// svg | placeholder
return <div dangerouslySetInnerHTML={{ __html: ill.markup }} />;
```

Чтобы сменить формат у вопроса: положите файл `public/illustrations/q042.png` и в JSON укажите `"illustration": "illustrations/q042.png"`.

## Миграция в Postgres / Neon

Четыре массива ложатся в четыре таблицы один-в-один:

- `topics (topic_id PK, topic_name)`
- `questions (id PK, question_number, question_content, answer, topic_id FK, illustration NULLABLE)`
- `verses (id PK, book, chapter, verses, reference, text NULLABLE)`
- `question_verses (question_id FK, verse_id FK, position, PRIMARY KEY (question_id, verse_id))`

JSON остаётся форматом сидов: скрипт читает `data/catechism.json` и делает `INSERT` по массивам. Zod-схема из `utils/catechism.ts` может использоваться тем же скриптом для валидации перед загрузкой.
