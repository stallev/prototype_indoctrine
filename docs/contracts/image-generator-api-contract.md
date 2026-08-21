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
//   (Grok Imagine: 148:105 и 5:4 → 4:3; 4:5 → 3:4; 21:9 → 20:9).
// Модель зафиксирована: grok-imagine-image (не передаётся в теле запроса).
// Валидируется в app/api/image-generator/route.ts через zod до вызова провайдера
```

Порядок проверок в `route.ts`: `Origin` (§ ниже) → `x-image-generator-key` (§4) → тело запроса/`prompt`+`aspectRatio` (zod) → вызов xAI. Любая из первых трёх проваливается — до API дело не доходит.

## 2. Успешный ответ

```
200 OK
Content-Type: application/json

{ "image": string, "estimatedCostUsd": number }
// image — data URL: `data:${mediaType};base64,${base64}`, собран из GeneratedFile (ai v7 generateImage()) — mediaType приходит от провайдера (обычно image/png)
// estimatedCostUsd — примерная себестоимость: grok-imagine-image, flat $0.02 (lib/image-generator-pricing.ts)
```

Вызов — стабильный (не `experimental_generateImage`) `generateImage({ model, prompt, aspectRatio })` из пакета `ai` v7 в `lib/image-generator-generate.ts`: `createXai({ apiKey: process.env.GROK_API_KEY })` + `xai.image('grok-imagine-image')` (`@ai-sdk/xai` v4). xAI запрашивает `response_format: b64_json`; если base64 нет, SDK сам скачивает URL — клиенту всё равно уходит data URL.

Без `aspectRatio` провайдер по умолчанию отдаёт кадр около 1:1. `size` у Grok не поддерживается.

## 3. Ответ с ошибкой

```
4xx/5xx
Content-Type: application/json

{ "error": string }    // понятное пользователю сообщение, не сырой стектрейс/детали провайдера
```

Случаи ошибки: недопустимый `Origin` (403), отсутствующий/неверный `x-image-generator-key` (401, §4), пустой/слишком длинный промпт или неизвестное соотношение (4xx, валидация до вызова провайдера), ошибка/лимит xAI (5xx или 502, сообщение без внутренних деталей), отсутствие/невалидность серверного ключа — `GROK_API_KEY` или `SECURITY_IMAGE_GENERATOR_KEY` (5xx — ошибка конфигурации).

## 4. Секреты и окружение

| Переменная | Где используется | Требование |
|---|---|---|
| `GROK_API_KEY` | только внутри `lib/image-generator-generate.ts`, серверная сторона | Никогда не передаётся клиенту, не логируется, не входит в клиентский бандл. Не `XAI_API_KEY` |
| `SECURITY_IMAGE_GENERATOR_KEY` | `app/tools/image-generator/actions.ts` (Server Action, проверка UI-gate) и `app/api/image-generator/route.ts` (проверка заголовка `x-image-generator-key`), через общий `lib/image-generator-auth.ts` | Тот же уровень секретности — никогда клиенту/логам/бандлу. Сравнение — `secretsMatch()` (`crypto.timingSafeEqual` по SHA-256-хэшам), не `===` |

Переменные уже присутствуют в локальном `.env` (не коммитится, см. `.gitignore`). `.env.example` документирует имена без значений — держать в актуальном состоянии при добавлении новых секретов.

**Клиентский источник заголовка**: значение `x-image-generator-key` берётся не из отдельного состояния, а из того же `localStorage`-ключа (`image-generator-access-key`), который `ImageGeneratorAccessGate` уже верифицировал при открытии страницы, — второй независимый источник истины не заводится (см. `image-generator-tool-spec.md` §6.1).

**Важно при реализации:** `GROK_API_KEY` — не то имя, которое `@ai-sdk/xai` ищет автоматически (`XAI_API_KEY`). Провайдер создаётся явно:

```ts
import { createXai } from '@ai-sdk/xai';

const xai = createXai({ apiKey: process.env.GROK_API_KEY });
```

Не полагаться на неявное чтение переменной окружения SDK по умолчанию.

## 5. Клиентский контракт скачивания

Ответ `{ image: string }` конвертируется на клиенте в `Blob`, скачивание — через `<a download>`, инициированное кликом пользователя (не автоматически при получении ответа).

## 6. Definition of Done для задач, реализующих этот контракт

- `POST` с валидным `prompt` и верным `x-image-generator-key` возвращает `200` и `{ image }`.
- `POST` с пустым `prompt` возвращает `4xx` и `{ error }`, без вызова провайдера.
- `POST` без `x-image-generator-key`/с неверным значением возвращает `401` и `{ error }`, без вызова провайдера — проверяется до валидации `prompt`.
- `grep -r` значений `GROK_API_KEY`/`SECURITY_IMAGE_GENERATOR_KEY` по собранному клиентскому бандлу (`.next/static`) не находит ни одного значения.
- Браузерный тест: страница показывает форму ввода ключа доступа до разблокировки; после верного ключа — форма генерации показывает pending-состояние на время запроса, ошибка отображается как понятное сообщение без падения страницы.
