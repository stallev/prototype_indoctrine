# Чек-лист реализации статического прототипа

Порядок работ после утверждения документации. Отмечать пункты по мере выполнения.

Спеки:

- [`static-prototype-spec.md`](static-prototype-spec.md) — UI, роутинг, меню, рендер
- [`svg-prompts-ts-spec.md`](svg-prompts-ts-spec.md) — массив промптов
- [`specs/svg-illustration-spec.md`](../specs/svg-illustration-spec.md) — генерация SVG

---

## Фаза 0. Подготовка

- [ ] Прочитать `docs/static-prototype-spec.md` и `docs/svg-prompts-ts-spec.md`
- [ ] Убедиться, что `data/catechism.json` и `images/_placeholder.svg` на месте

---

## Фаза 1. Scaffold

- [ ] Создать `package.json` с `tailwindcss`, `@tailwindcss/cli`, скриптами `build:css`, `watch:css`, `serve`
- [ ] Создать каталоги: `styles/`, `js/`, `public/illustrations/`
- [ ] Добавить `styles/input.css` (`@import "tailwindcss"` + `@theme` + Material CSS variables)
- [ ] Собрать `styles/app.css` (`npm run build:css`)
- [ ] Создать заготовку `index.html` (app bar, drawer, overlay, `#app-main`)
- [ ] Подключить `styles/app.css` и `js/app.js` (module) в HTML
- [ ] Проверить отдачу через static server (`npm run serve`)

---

## Фаза 2. HTML shell и Material-стили

- [ ] Top App Bar: заголовок продукта, кнопка-гамбургер (mobile)
- [ ] Navigation Drawer + overlay
- [ ] Базовая типографика и поверхности через CSS variables / Tailwind
- [ ] Mobile-first вёрстка; на `md+` — постоянный drawer
- [ ] Без фиолетовых «AI-дефолтных» градиентов; палитра согласована со спекой

---

## Фаза 3. Данные и роутинг

- [ ] Реализовать `js/catechism-browser.js`: `initCatechism`, `questionsForTopic`, `versesForQuestion`, `getQuestionWithVerses`, пути иллюстраций
- [ ] В `js/app.js`: `fetch('data/catechism.json')`, инициализация, обработка ошибок загрузки
- [ ] Hash-роутер: `#/`, `#/topic/:id`, `#/q/:n`
- [ ] Рендер оглавления (16 topics)
- [ ] Рендер списка вопросов раздела
- [ ] Рендер страницы вопроса: номер, вопрос, ответ, стихи, prev/next
- [ ] Правила: пустые стихи скрыты; `text === null` → только reference; кавычки `« »` при рендере
- [ ] Экранирование текста из JSON (XSS)

---

## Фаза 4. Мобильное меню

- [ ] Открытие/закрытие drawer (гамбургер, overlay, Escape, выбор пункта)
- [ ] Accordion / вложенный список: topic → questions
- [ ] `aria-expanded`, `aria-controls`, `aria-current`, focus trap на mobile
- [ ] При resize на `md+` — сброс modal-состояния drawer
- [ ] Touch-цели ≥ 44px

---

## Фаза 5. Иллюстрации и placeholder

- [ ] `<img>` с `src` из `public/` + `question.illustration`
- [ ] `onerror` → `images/_placeholder.svg` без цикла перезагрузки
- [ ] `alt`, `aspect-ratio: 4/3`
- [ ] Проверка: при пустом `public/illustrations/` все вопросы показывают placeholder

---

## Фаза 6. Файл промптов SVG

- [ ] Создать `prompts/illustration-prompts.ts` по [`svg-prompts-ts-spec.md`](svg-prompts-ts-spec.md)
- [ ] Экспорт типов, массива, `getPromptByQuestionNumber`, `promptsMissingSceneBrief`, `promptsMissingNumbers`
- [ ] Каркас 114 записей с метаданными из JSON
- [ ] Наполнить все `scene_brief` (чувствительные — по §7 svg-спеки)
- [ ] Собрать все `prompt` по шаблону §8 (блок стиха опускать при отсутствии)
- [ ] Валидация: `promptsMissingSceneBrief()` и `promptsMissingNumbers()` → `[]`

---

## Фаза 7. Генерация SVG

- [ ] Генерировать `public/illustrations/qNNN.svg` батчами из `illustrationPrompts`
- [ ] Проверять каждый файл (или выборку + все чувствительные) по чек-листу §9
- [ ] Убедиться, что `questions[].illustration` в JSON совпадает с именем файла
- [ ] В прототипе placeholder заменяется на реальные SVG по мере появления файлов

---

## Фаза 8. Приёмка

### Прототип UI

- [ ] Все 114 вопросов открываются по `#/q/:n`
- [ ] Разделы и состав вопросов совпадают с JSON
- [ ] Mobile drawer и desktop drawer работают по спеке
- [ ] Missing images → placeholder
- [ ] CSS — внешний собранный Tailwind v4; JS — внешние модули
- [ ] Работает через static server

### Промпты и иллюстрации

- [ ] `prompts/illustration-prompts.ts` соответствует контракту
- [ ] Покрытие SVG: отслеживать через отсутствие файлов / будущий `missingIllustrations()` на сборке
- [ ] Нет нарушений доктринальных правил §2 в принятых иллюстрациях

---

## Рекомендуемый порядок коммитов (ориентир)

1. Scaffold + CSS tokens + пустой shell
2. Browser-хелперы + роутер + рендер контента
3. Mobile drawer + a11y
4. Illustration fallback
5. `illustration-prompts.ts` (сначала каркас, потом brief/prompt)
6. SVG пакетами по разделам

Код на фазах 1–5 не блокируется отсутствием SVG: UI полон с placeholder.
