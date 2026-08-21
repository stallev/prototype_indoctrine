import type { Verse } from '@/content';

interface VerseBlockProps {
  verse: Verse;
}

/**
 * Один стих в списке цитат вопроса. Правила рендера — §7.3
 * static-prototype-spec.md / content-data-contract.md §3:
 *   - `text === null` (7 стихов) → только reference, без blockquote.
 *   - иначе — цитата с добавленными при рендере внешними «…» (в JSON их нет).
 */
export const VerseBlock = ({ verse }: VerseBlockProps) => (
  <li className="border-l-4 border-md-secondary/40 pl-3 md:pl-4">
    {verse.text !== null && (
      <blockquote className="italic leading-relaxed md:text-xl lg:text-2xl">
        «{verse.text}»
      </blockquote>
    )}
    <cite className="mt-1 block text-sm not-italic text-md-secondary md:text-base lg:text-lg">
      {verse.reference}
    </cite>
  </li>
);
