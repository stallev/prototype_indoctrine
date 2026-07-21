# Иллюстрации катехизиса

Файлы лежат в `public/illustrations/` (не в этой папке). Здесь — код разрешения на сборке.

## Форматы

| Формат | Расширение | Рендер |
|--------|------------|--------|
| Вектор | `.svg` | Инлайн через `resolveIllustration` → `markup` |
| Растр | `.png`, `.jpg`, `.jpeg`, `.webp` | `<img src>` через `resolveIllustration` → `src` |

Имя: `qNNN.<ext>` (`q001` … `q114`). В `catechism.json` → `questions[].illustration` — только путь относительно `public/` (напр. `illustrations/q042.png`).

## Требования

- Для **SVG** — `specs/svg-illustration-spec.md` (viewBox, палитра, доктрина).
- Для **растра** — те же доктринальные ограничения спеки §2 / §7; рекомендуемый кадр 4:3 (1200×900).
- `sanitizeSvg` — только для инлайн-SVG (XSS); не заменяет чек-лист спеки.

## API

```ts
import { resolveIllustration } from './illustrations.node';

const ill = resolveIllustration(42);
// { kind: 'svg', markup } | { kind: 'raster', src, path } | { kind: 'placeholder', markup }
```

`missingIllustrations()` — номера без пути или без файла на диске.
