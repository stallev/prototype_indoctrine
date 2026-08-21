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
x-image-generator-key: string   // обязателен (2026-08-21) — тот же ключ, что проверен ImageGeneratorAccessGate на странице, см. §4

{ "prompt": string, "aspectRatio": string }
// prompt — непустая строка (после trim), максимум 4000 символов (хватает на полные промпты из prompts/grok-card-prompts.md)
// aspectRatio — одно из значений allowlist в lib/image-generator-aspect-ratios.ts
//   (дефолт UI / localStorage: "148:105"; популярные: 3:2, 4:3, 16:9, 1:1, …)
//   Перед generateImage значение прогоняется через toProviderAspectRatio()
//   (148:105 → 4:3 — Gemini не принимает произвольные соотношения).
// Валидируется в app/api/image-generator/route.ts через zod до вызова провайдера
```

Порядок проверок в `route.ts`: `Origin` (§ ниже) → `x-image-generator-key` (§4) → тело запроса/`prompt`+`aspectRatio` (zod) → вызов провайдера. Любая из первых трёх проваливается — до Google API дело не доходит.

## 2. Успешный ответ

```
200 OK
Content-Type: application/json

{ "image": string, "estimatedCostUsd": number }
// image — data URL: `data:${mediaType};base64,${base64}`, собран из GeneratedFile (ai v7 generateImage()) — mediaType приходит от провайдера (обычно image/png)
// estimatedCostUsd — Примерная себестоимость этой генерации в USD (Paid tier gemini-2.5-flash-image:
//   ~$0.039 за output-картинку + оценка input-токенов промпта @ $0.30/1M; см. lib/image-generator-pricing.ts)
```

Зафиксировано при реализации 9.4.1: модель — `gemini-2.5-flash-image` (Gemini 2.5 Flash Image) через `google.image(modelId)` (`@ai-sdk/google` v4, метод `.image()` создаёт `ImageModelV4`), вызов — стабильный (не `experimental_generateImage`) `generateImage({ model, prompt, aspectRatio })` из пакета `ai` v7. Без `aspectRatio` провайдер отдаёт квадрат 1:1 (~1024×1024). Обе версии пакетов на момент реализации уже поддерживают этот путь как основной, non-experimental API — `generateText` с `responseModalities` не потребовался.

## 3. Ответ с ошибкой

```
4xx/5xx
Content-Type: application/json

{ "error": string }    // понятное пользователю сообщение, не сырой стектрейс/детали провайдера
```

Случаи ошибки: недопустимый `Origin` (403), отсутствующий/неверный `x-image-generator-key` (401, §4), пустой/слишком длинный промпт (4xx, валидация до вызова провайдера), ошибка/лимит Google API (5xx или 502, сообщение без внутренних деталей провайдера), отсутствие/невалидность серверного ключа — `GEMINI_API_KEY` или `SECURITY_IMAGE_GENERATOR_KEY` (5xx — это ошибка конфигурации, не должна быть достижима в норме).

## 4. Секреты и окружение

| Переменная | Где используется | Требование |
|---|---|---|
| `GEMINI_API_KEY` | только внутри `app/api/image-generator/route.ts`, серверная сторона | Никогда не передаётся клиенту, не логируется, не входит в клиентский бандл (`grep` по собранному клиентскому JS не должен находить значение) |
| `SECURITY_IMAGE_GENERATOR_KEY` | `app/tools/image-generator/actions.ts` (Server Action, проверка UI-gate) и `app/api/image-generator/route.ts` (проверка заголовка `x-image-generator-key`), через общий `lib/image-generator-auth.ts` | Тот же уровень секретности, что и `GEMINI_API_KEY` — никогда клиенту/логам/бандлу. Сравнение — `secretsMatch()` (`crypto.timingSafeEqual` по SHA-256-хэшам), не `===` |

Обе переменные уже присутствуют в локальном `.env` (не коммитится, см. `.gitignore`). `.env.example` документирует оба имени без значений — держать в актуальном состоянии при добавлении новых секретов.

**Клиентский источник заголовка**: значение `x-image-generator-key` берётся не из отдельного состояния, а из того же `localStorage`-ключа (`image-generator-access-key`), который `ImageGeneratorAccessGate` уже верифицировал при открытии страницы, — второй независимый источник истины не заводится (см. `image-generator-tool-spec.md` §6.1).

**Важно при реализации:** `GEMINI_API_KEY` — не то имя, которое `@ai-sdk/google` ищет автоматически (SDK по умолчанию ищет `GOOGLE_GENERATIVE_AI_API_KEY`). Провайдер нужно создавать явно с этим ключом, например:

```ts
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
```

Не полагаться на неявное чтение переменной окружения SDK по умолчанию.

## 5. Клиентский контракт скачивания

Ответ `{ image: string }` конвертируется на клиенте в `Blob`, скачивание — через `<a download>`, инициированное кликом пользователя (не автоматически при получении ответа).

## 6. Definition of Done для задач, реализующих этот контракт

- `POST` с валидным `prompt` и верным `x-image-generator-key` возвращает `200` и `{ image }`.
- `POST` с пустым `prompt` возвращает `4xx` и `{ error }`, без вызова провайдера.
- `POST` без `x-image-generator-key`/с неверным значением возвращает `401` и `{ error }`, без вызова провайдера — проверяется до валидации `prompt`.
- `grep -r` значения `GEMINI_API_KEY`/`SECURITY_IMAGE_GENERATOR_KEY` по собранному клиентскому бандлу (`.next/static`) не находит ни одного значения.
- Браузерный тест: страница показывает форму ввода ключа доступа до разблокировки; после верного ключа — форма генерации показывает pending-состояние на время запроса, ошибка отображается как понятное сообщение без падения страницы.
