# Чек-лист реализации статического прототипа

Порядок работ после утверждения документации. Отмечать пункты по мере выполнения.

Спеки:

- [`static-prototype-spec.md`](static-prototype-spec.md) — UI, роутинг, меню, рендер
- [`svg-prompts-ts-spec.md`](svg-prompts-ts-spec.md) — массив промптов
- [`specs/svg-illustration-spec.md`](../specs/svg-illustration-spec.md) — генерация SVG

---

## Фаза 0. Подготовка

- [x] Прочитать `docs/static-prototype-spec.md` и `docs/svg-prompts-ts-spec.md`
- [x] Убедиться, что `data/catechism.json` и `images/_placeholder.svg` на месте

---

## Фаза 1. Scaffold

- [x] Создать `package.json` с `tailwindcss`, `@tailwindcss/cli`, скриптами `build:css`, `watch:css`, `serve`
- [x] Создать каталоги: `styles/`, `js/`, `public/illustrations/`
- [x] Добавить `styles/input.css` (`@import "tailwindcss"` + `@theme` + Material CSS variables)
- [x] Собрать `styles/app.css` (`npm run build:css`)
- [x] Создать заготовку `index.html` (app bar, drawer, overlay, `#app-main`)
- [x] Подключить `styles/app.css` и `js/app.js` (module) в HTML
- [x] Проверить отдачу через static server (`npm run serve`)

---

## Фаза 2. HTML shell и Material-стили

- [x] Top App Bar: заголовок продукта, кнопка-гамбургер (mobile)
- [x] Navigation Drawer + overlay
- [x] Базовая типографика и поверхности через CSS variables / Tailwind
- [x] Mobile-first вёрстка; на `md+` — постоянный drawer
- [x] Без фиолетовых «AI-дефолтных» градиентов; палитра согласована со спекой

---

## Фаза 3. Данные и роутинг

- [x] Реализовать `js/catechism-browser.js`: `initCatechism`, `questionsForTopic`, `versesForQuestion`, `getQuestionWithVerses`, пути иллюстраций
- [x] В `js/app.js`: `fetch('data/catechism.json')`, инициализация, обработка ошибок загрузки
- [x] Hash-роутер: `#/`, `#/topic/:id`, `#/q/:n`
- [x] Рендер оглавления (16 topics)
- [x] Рендер списка вопросов раздела
- [x] Рендер страницы вопроса: номер, вопрос, ответ, стихи, prev/next
- [x] Правила: пустые стихи скрыты; `text === null` → только reference; кавычки `« »` при рендере
- [x] Экранирование текста из JSON (XSS) — через `textContent`, без `innerHTML`-интерполяции

---

## Фаза 4. Мобильное меню

- [x] Открытие/закрытие drawer (гамбургер, overlay, Escape, выбор пункта)
- [x] Accordion / вложенный список: topic → questions
- [x] `aria-expanded`, `aria-controls`, `aria-current`, focus trap на mobile
- [x] При resize на `md+` — сброс modal-состояния drawer
- [x] Touch-цели ≥ 44px

---

## Фаза 5. Иллюстрации и placeholder

- [x] `<img>` с `src` из `public/` + `question.illustration`
- [x] `onerror` → `images/_placeholder.svg` без цикла перезагрузки
- [x] `alt`, `aspect-ratio: 4/3`
- [x] Проверка: при пустом `public/illustrations/` все вопросы показывают placeholder

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
