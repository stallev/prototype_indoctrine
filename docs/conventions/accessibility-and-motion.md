# Конвенции: доступность и анимация

Детализация §4 [`../coding-conventions.md`](../coding-conventions.md) — адаптировано из `ui-semantics-a11y.mdc` и `ui-animation-performance.mdc` (см. [`../ADRs/adr-001-cursor-rules-delivery.md`](../ADRs/adr-001-cursor-rules-delivery.md)). Мобильные брейкпоинты и touch-цели уже зафиксированы в [`../specs/static-prototype-spec.md`](../specs/static-prototype-spec.md) §4 — здесь не дублируются, только a11y и анимация.

**Статус:** предложено (ожидает утверждения)

Связанные документы: [`../coding-conventions.md`](../coding-conventions.md) §4 · [`../multi-agent-workflow.md`](../multi-agent-workflow.md) §4 (как это проверяется браузерным тестированием) · [`../specs/static-prototype-spec.md`](../specs/static-prototype-spec.md) §4, §6.2

---

## 1. Цель

**WCAG 2.1 уровень AA** — контраст, клавиатура, имена элементов, структура документа. Это не необязательное улучшение — `quality-checker` проверяет это как часть Definition of Done для любой UI-задачи (`multi-agent-workflow.md` §4).

## 2. Семантическая разметка (обязательно)

- **Landmarks:** `<main>`, `<nav>`, `<header>`, `<footer>` — не заменять на `<div>` без причины.
- **Интерактив:** `<button type="button"|"submit">`, `<a href>` — не `<div onClick>`/`<span role="button">` для стандартных действий.
- **Формы** (форма генератора изображений): `<label htmlFor>` + `id` на поле.
- **Заголовки:** ровно один `<h1>` на страницу вопроса/раздела; иерархия `h1 → h2 → h3` без пропусков ради стиля.
- **Изображения:** содержательный `alt` на иллюстрациях (`«Иллюстрация к вопросу {N}: {question_content}»` — см. `static-prototype-spec.md` §8.3); декоративные элементы — `alt=""`/`aria-hidden`.
- **Язык:** `lang="ru"` на `<html>` в корневом `layout.tsx`.

## 3. A11y-требования

| Область | Требование |
|---|---|
| Имена | У каждого интерактивного элемента — видимый label или `aria-label`; icon-only (гамбургер, закрытие drawer) → `aria-label` |
| Иконки | Декоративные `lucide-react` — `aria-hidden`; смысл — в тексте/label, не только в иконке |
| Фокус | Видимый `focus-visible:` стиль; порядок табуляции = визуальный порядок |
| Drawer/модалки | Focus trap, Escape закрывает — обеспечивается shadcn/Radix `Sheet`, но **проверяется** явно (не считается «бесплатным») |
| Формы | `aria-invalid`, `aria-describedby` при ошибке валидации промпта |
| Контраст | AA: текст 4.5:1, UI-элементы 3:1 — на токенах Material-палитры (`static-prototype-spec.md` §5.1) |
| Motion | `prefers-reduced-motion` — анимация не обязательна для понимания интерфейса |
| Touch | Цели ≥ 44×44px (уже требование `static-prototype-spec.md` §4) |
| Цвет | Статус/ошибка не только цветом — текст или иконка тоже |

## 4. Приоритет примитивов

1. Нативный HTML-элемент с правильной семантикой.
2. shadcn/ui (Radix) — `Sheet`, `Dialog` и т.п. — уже даёт a11y-механику.
3. Кастомный ARIA — только если 1–2 недостаточно; не дублировать поведение браузера вручную.

## 5. Чек-лист перед завершением UI-задачи

- [ ] Landmarks и иерархия заголовков корректны.
- [ ] Нет `div`-как-кнопка/`div`-как-ссылка.
- [ ] Формы связаны с `label`; ошибки доступны для screen reader.
- [ ] Клавиатура: `Tab` проходит по интерактиву; `Enter`/`Space` на кнопках; `Escape` закрывает drawer/оверлей.
- [ ] Icon-only элементы именованы (`aria-label`).
- [ ] Контраст текста/CTA проверен на реальной палитре.

Это соответствует браузерным проверкам, которые `quality-checker` уже выполняет по `multi-agent-workflow.md` §4 (`read_page`, `resize_window`, проверка `aria-*`) — этот файл описывает **что именно** проверяется, workflow — **как**.

---

## 6. Анимация и производительность рендера

- **Анимировать** только `transform` и `opacity` (композитинг на GPU).
- **Не анимировать** `width`, `height`, `margin`, `padding`, `top`, `left` — вызывает layout/reflow.
- Не использовать `transition-all` там, где меняются layout-свойства — явно перечислять анимируемые свойства.
- Глобальный сброс через `prefers-reduced-motion` в `app/globals.css` (см. §3 выше).
- Измерения DOM (`getBoundingClientRect`, `offsetWidth`) — через `useLayoutEffect`/`ResizeObserver`, никогда в теле рендера.
- `will-change` — только для постоянно анимируемых элементов или добавлять/убирать точечно вокруг одноразовой анимации; не ставить массово на все карточки/компоненты.

### Чек-лист

- [ ] Hover/появление используют `translate`/`scale`/`opacity`, не layout-свойства.
- [ ] Нет `offsetWidth`/`getBoundingClientRect` в теле рендера.
- [ ] Tailwind: `transition-transform`, не `transition-all` на интерактивных поверхностях.
