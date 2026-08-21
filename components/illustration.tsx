import Image from 'next/image';

import { resolveIllustration } from '@/lib/illustrations';

interface IllustrationProps {
  questionNumber: number;
  questionContent: string;
}

/**
 * Иллюстрация вопроса. Три состояния из lib/illustrations.ts:
 *   - svg / placeholder → инлайн-разметка (уже санитизирована/сгенерирована
 *     resolveIllustration), масштабируется на весь контейнер 4:3.
 *   - raster (png/jpg/webp) → next/image по публичному URL из public/.
 * Рамка 4:3 — та же пропорция viewBox="0 0 1200 900", что и у старого
 * прототипа (.illustration-frame в styles/input.css), здесь как утилита
 * Tailwind (aspect-[4/3]), т.к. этот класс определён только в CSS старого
 * стека, а не в app/globals.css.
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
        className="aspect-[4/3] w-full object-contain"
      />
    );
  }

  if (resolved.kind === 'svg') {
    return (
      <div
        className="aspect-[4/3] w-full [&>svg]:h-full [&>svg]:w-full [&>svg]:object-contain"
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
      className="aspect-[4/3] w-full [&>svg]:h-full [&>svg]:w-full [&>svg]:object-contain"
      role="img"
      aria-label={alt}
      // placeholderSvg() output, same legitimate inline-SVG path as above.
      dangerouslySetInnerHTML={{ __html: resolved.markup }}
    />
  );
};
