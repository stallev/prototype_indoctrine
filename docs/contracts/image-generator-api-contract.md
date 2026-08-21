# Контракт API инструмента генерации изображений

Формальный контракт `POST /api/image-generator` — единственного серверного роута приложения. Источник истины для реализации `app/api/image-generator/route.ts` и его клиента `app/tools/image-generator/page.tsx`.

**Статус:** предложено (ожидает утверждения)

Связанные документы:

- [`../specs/image-generator-tool-spec.md`](../specs/image-generator-tool-spec.md) — полная спека инструмента (UI, деплой, безопасность)
- [`../implementation/phase-9.4-image-generator-tool.md`](../implementation/phase-9.4-image-generator-tool.md) — задачи, реализующие этот контракт
- [`../coding-conventions.md`](../coding-conventions.md) §5 — конвенции безопасности, применимые к этому роуту

---

## 1. Запрос

```
POST /api/image-generator
Content-Type: application/json

{ "prompt": string }   // непустая строка (после trim), максимум 1000 символов — валидируется в app/api/image-generator/route.ts через zod до вызова провайдера
```

## 2. Успешный ответ

```
200 OK
Content-Type: application/json

{ "image": string }    // data URL: `data:${mediaType};base64,${base64}`, собран из GeneratedFile (ai v7 generateImage()) — mediaType приходит от провайдера (обычно image/png)
```

Зафиксировано при реализации 9.4.1: модель — `gemini-2.5-flash-image` (Gemini 2.5 Flash Image) через `google.image(modelId)` (`@ai-sdk/google` v4, метод `.image()` создаёт `ImageModelV4`), вызов — стабильный (не `experimental_generateImage`) `generateImage({ model, prompt })` из пакета `ai` v7. Обе версии пакетов на момент реализации уже поддерживают этот путь как основной, non-experimental API — `generateText` с `responseModalities` не потребовался.

## 3. Ответ с ошибкой

```
4xx/5xx
Content-Type: application/json

{ "error": string }    // понятное пользователю сообщение, не сырой стектрейс/детали провайдера
```

Случаи ошибки: пустой/слишком длинный промпт (4xx, валидация до вызова провайдера), ошибка/лимит Google API (5xx или 502, сообщение без внутренних деталей провайдера), отсутствие/невалидность серверного ключа (5xx — это ошибка конфигурации, не должна быть достижима в норме).

## 4. Секреты и окружение

| Переменная | Где используется | Требование |
|---|---|---|
| `GEMINI_API_KEY` | только внутри `app/api/image-generator/route.ts`, серверная сторона | Никогда не передаётся клиенту, не логируется, не входит в клиентский бандл (`grep` по собранному клиентскому JS не должен находить значение) |

Переменная уже присутствует в локальном `.env` (не коммитится, см. `.gitignore`). `.env.example` документирует имя переменной без значения — держать в актуальном состоянии при добавлении новых секретов.

**Важно при реализации:** `GEMINI_API_KEY` — не то имя, которое `@ai-sdk/google` ищет автоматически (SDK по умолчанию ищет `GOOGLE_GENERATIVE_AI_API_KEY`). Провайдер нужно создавать явно с этим ключом, например:

```ts
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
```

Не полагаться на неявное чтение переменной окружения SDK по умолчанию.

## 5. Клиентский контракт скачивания

Ответ `{ image: string }` конвертируется на клиенте в `Blob`, скачивание — через `<a download>`, инициированное кликом пользователя (не автоматически при получении ответа).

## 6. Definition of Done для задач, реализующих этот контракт

- `POST` с валидным `prompt` возвращает `200` и `{ image }`.
- `POST` с пустым `prompt` возвращает `4xx` и `{ error }`, без вызова провайдера.
- `grep -r GEMINI_API_KEY` по собранному клиентскому бандлу (`.next/static`) не находит значения ключа.
- Браузерный тест: форма показывает pending-состояние на время запроса, ошибка отображается как понятное сообщение без падения страницы.
