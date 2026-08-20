# Фаза 9.4 — Инструмент генерации изображений

**Статус фазы:** todo

Связанные документы: [`README.md`](README.md) · [`../specs/image-generator-tool-spec.md`](../specs/image-generator-tool-spec.md) · [`../contracts/image-generator-api-contract.md`](../contracts/image-generator-api-contract.md) · [`../coding-conventions.md`](../coding-conventions.md) §5

Не зависит от Фаз 9.1–9.3 (инструмент самостоятелен, не использует `content/*.ts`) — может выполняться параллельно с ними.

---

### 9.4.1 — `app/api/image-generator/route.ts`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** соответствует `image-generator-api-contract.md` §6 целиком — валидный `prompt` → `200 { image }`; пустой `prompt` → `4xx { error }` без вызова провайдера; `grep` по собранному клиентскому бандлу (`.next/static`) не находит значение `GEMINI_API_KEY`.
- **Описание:** Node Route Handler, Vercel AI SDK (`@ai-sdk/google`), ключ — `GEMINI_API_KEY` из `.env` (уже добавлен), провайдер создаётся явно через `createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })` — см. `image-generator-api-contract.md` §4 (это не то имя переменной, которое SDK ищет по умолчанию). Точная модель (Gemini 2.5 Flash Image / Imagen) и точный вызов SDK — открытый вопрос `image-generator-tool-spec.md` §7, фиксируется при реализации этой задачи (обновить контракт §2 при необходимости, если формат ответа отличается от изначально предполагаемого data URL).
- **Конвенции:** [`../conventions/data-routing-security.md`](../conventions/data-routing-security.md) §1 (почему Route Handler, не Server Action), §4 (обязательный `.catch()`/`try-catch` на вызове провайдера), §6 (**обязательная проверка `Origin`** — этот роут не получает её автоматически, в отличие от Server Actions), §7 (секреты).
- **Заметки агентов:** —

### 9.4.2 — `app/tools/image-generator/page.tsx`

- **Статус:** todo
- **Попытки:** 0
- **Definition of Done:** браузерный тест — форма отправляет промпт на 9.4.1, показывает pending-состояние (кнопка заблокирована/индикатор) на время запроса, отображает превью результата, кнопка скачивания сохраняет файл через `<a download>` по клику; ошибка API отображается как понятное сообщение, страница не падает.
- **Описание:** `'use client'` форма — единственная клиентская страница инструмента. Не связана ссылками с навигацией по катехизису (drawer, `/topic/*`, `/q/*`). UI-задача — браузерное тестирование обязательно.
- **Конвенции:** [`../conventions/hooks-and-state.md`](../conventions/hooks-and-state.md) §1 (дискриминированное объединение `idle`/`pending`/`success`/`error`, не три независимых булевых состояния), §2 (`AbortController` на `useEffect`-очистке при уходе со страницы, `useTransition` не блокирует саму кнопку) · [`../conventions/accessibility-and-motion.md`](../conventions/accessibility-and-motion.md) §2–3 (`label`/`aria-invalid` на форме) · [`../conventions/copy-icons-fidelity.md`](../conventions/copy-icons-fidelity.md) §1 (строки формы — из `lib/messages.ts`, не инлайн).
- **Заметки агентов:** —
