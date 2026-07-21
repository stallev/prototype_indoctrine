# Иллюстрации катехизиса

SVG-файлы лежат в `public/illustrations/` (не в этой папке). Здесь — код инлайна на сборке и документация.

## Соглашение об именах

`public/illustrations/qNNN.svg`, где `NNN` — номер вопроса с ведущими нулями: `q001.svg` … `q114.svg`.
В `catechism.json` → `questions[].svg_image` — только путь относительно `public/` (напр. `illustrations/q001.svg`), не разметка SVG.

## Требования к файлам

- Единый `viewBox="0 0 1200 900"`, `preserveAspectRatio="xMidYMid meet"`.
- Только вектор: без `<script>`, `<image>`, base64, внешних ссылок.
- Палитра и правила — см. `specs/svg-illustration-spec.md`.
- `sanitizeSvg` снимает XSS; полный чек-лист качества — в спеке §9.

## Инлайн на сборке

Файлы встраиваются функцией `inlineSvg(n)` из `illustrations.node.ts` (читает `public/` + путь из JSON).
Пока файла нет или `svg_image === null` — нейтральный плейсхолдер (страница не падает).
`missingIllustrations()` возвращает список ещё не готовых номеров.
