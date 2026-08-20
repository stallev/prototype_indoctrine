# Фаза 9.1 — Контент как TypeScript

**Статус фазы:** todo

Связанные документы: [`README.md`](README.md) (формат задач, кто редактирует) · [`../contracts/content-data-contract.md`](../contracts/content-data-contract.md) (контракт, который эти задачи реализуют) · [`../specs/nextjs-migration-spec.md`](../specs/nextjs-migration-spec.md) §3–4 · [`../../utils/catechism.ts`](../../utils/catechism.ts) (исходная логика для порта)

---

### 9.1.1 — Создать `scripts/migrate-json-to-ts.ts`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** скрипт запускается (`node`/`tsx`), читает `data/catechism.json`, валидирует через `CatechismSchema` из `utils/catechism.ts` (та же `superRefine`-проверка ссылочной целостности), явно падает с ненулевым кодом на битых/несуществующих данных.
- **Описание:** Разовый Node-скрипт, не часть рантайма приложения. Импортирует `CatechismSchema` из `utils/catechism.ts` (не переписывает схему заново). При успешной валидации переходит к задаче 9.1.2 (генерация файлов) в рамках того же запуска либо как следующий шаг скрипта — на усмотрение реализации, главное, чтобы валидация была первым и обязательным шагом перед записью `content/*.ts`.
- **Конвенции:** [`../conventions/data-routing-security.md`](../conventions/data-routing-security.md) §4 (промисы/асинхронный код — обработка ошибок валидации и записи файлов).
- **Заметки агентов:** —

### 9.1.2 — Сгенерировать `content/topics.ts`, `questions.ts`, `verses.ts`, `question-verses.ts`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** файлы созданы, каждый экспортирует `as const`-массив; count-parity подтверждена выводом скрипта — 16 тем, 114 вопросов, 102 стиха, 110 связей (см. `content-data-contract.md` §3). Несовпадение счётчиков — исполнение задачи проваливается, файлы не считаются готовыми.
- **Описание:** Генерация — сериализация уже провалидированных (9.1.1) данных из `data/catechism.json` в TS-литералы `scripts/migrate-json-to-ts.ts`, не ручной перенос. Форма записей — точно по типам `content-data-contract.md` §2. Скрипт должен вывести отчёт (какие файлы созданы, счётчики) в stdout — `quality-checker` сверяет этот вывод.
- **Конвенции:** [`../conventions/components.md`](../conventions/components.md) §2 (именование: `SCREAMING_SNAKE_CASE` для констант, множественное число для массивов-коллекций).
- **Заметки агентов:** —

### 9.1.3 — Создать `content/index.ts`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** экспортирует `questionsForTopic`, `versesForQuestion`, `getQuestionWithVerses`, `illustrationStem`, `illustrationPath`, `illustrationPublicUrl`, `getTopic`, `allTopics` с сигнатурами из `content-data-contract.md` §4; `npm run build` проходит.
- **Описание:** Прямой порт одноимённых функций [`utils/catechism.ts`](../../utils/catechism.ts) на источник `content/*.ts` вместо Zod-parsed JSON — поведение и сигнатуры не меняются, меняется только источник массивов (`import { topics } from './topics'` и т.п. вместо `catechism.topics`). Индекс `verseById` (Map) — как в оригинале.
- **Конвенции:** [`../conventions/components.md`](../conventions/components.md) §6 (DRY — не оборачивать в generic data-layer/service класс, прямой порт функций) · [`../conventions/data-routing-security.md`](../conventions/data-routing-security.md) §2 (данные — не DAL, синхронное чтение констант, `'server-only'` не требуется здесь).
- **Заметки агентов:** —
