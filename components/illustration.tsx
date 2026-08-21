import Image from 'next/image';

import { resolveIllustration } from '@/lib/illustrations';

interface IllustrationProps {
  questionNumber: number;
  questionContent: string;
}

// Рамка 4:3 — та же пропорция viewBox="0 0 1200 900", что и у старого
// прототипа (.illustration-frame в styles/input.css), здесь как утилита
// Tailwind (aspect-[4/3]), т.к. этот класс определён только в CSS старого
// стека, а не в app/globals.css. На md+ дополнительно ограничена высота
// 350px (по запросу пользователя, 2026-08-21) — `max-h` только "подрезает"
// высоту, вычисленную из aspect-ratio, ширина (`w-full`) не меняется, поэтому
// `object-contain` в каждой из трёх веток вписывает исходную 4:3-картинку
// без искажения/обрезки (letterbox), а не растягивает/кадрирует её.
const FRAME_CLASS = 'aspect-[4/3] w-full md:max-h-[350px]';

/**
 * Иллюстрация вопроса. Три состояния из lib/illustrations.ts:
 *   - svg / placeholder → инлайн-разметка (уже санитизирована/сгенерирована
 *     resolveIllustration), масштабируется на весь контейнер.
 *   - raster (png/jpg/webp) → next/image по публичному URL из public/.
 */
export const Illustration = ({ questionNumber, questionContent }: IllustrationProps) => {
  const alt = `Иллюстрация к вопросу ${questionNumber}: ${questionContent}`;
  const resolved = resolveIllustration(questionNumber);

  if (resolved.kind === 'raster') {
    return (
      <Image
        src={resolved.src}
        alt={alt}
        width={1200}
        height={900}
        className={`${FRAME_CLASS} object-contain`}
      />
    );
  }

  if (resolved.kind === 'svg') {
    return (
      <div
        className={`${FRAME_CLASS} [&>svg]:h-full [&>svg]:w-full [&>svg]:object-contain`}
        role="img"
        aria-label={alt}
        // lib/illustrations.ts's sanitizeSvg() output — the one legitimate
        // dangerouslySetInnerHTML source in the project, see
        // docs/conventions/data-routing-security.md §5.
        dangerouslySetInnerHTML={{ __html: resolved.markup }}
      />
    );
  }

  return (
    <div
      className={`${FRAME_CLASS} [&>svg]:h-full [&>svg]:w-full [&>svg]:object-contain`}
      role="img"
      aria-label={alt}
      // placeholderSvg() output, same legitimate inline-SVG path as above.
      dangerouslySetInnerHTML={{ __html: resolved.markup }}
    />
  );
};
