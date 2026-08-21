import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionNavLinkProps {
  /** Номер соседнего вопроса, или null на границе (1 / 114) — рендерит disabled. */
  questionNumber: number | null;
  label: string;
  direction: 'prev' | 'next';
}

const disabledClassName =
  'inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-md-outline/20 px-4 py-2 text-sm font-medium text-md-outline md:px-5 md:py-2.5 md:text-base';
const enabledClassName =
  'inline-flex items-center gap-1.5 rounded-full border border-md-outline/40 px-4 py-2 text-sm font-medium text-md-primary transition-colors hover:bg-md-surface-tint/25 md:px-5 md:py-2.5 md:text-base';

/**
 * Кнопка «Предыдущий»/«Следующий» на странице вопроса. На границах (вопрос
 * 1 без «Предыдущий», 114 без «Следующий») — не ссылка, а `<button disabled>`
 * (нативная disabled-семантика вместо `aria-disabled` на `<span>`, чтобы
 * порядок из двух кнопок оставался стабильным на всех вопросах).
 */
export const QuestionNavLink = ({ questionNumber, label, direction }: QuestionNavLinkProps) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  const content = (
    <>
      {direction === 'prev' && <Icon aria-hidden="true" className="size-[18px] shrink-0" />}
      <span>{label}</span>
      {direction === 'next' && <Icon aria-hidden="true" className="size-[18px] shrink-0" />}
    </>
  );

  if (questionNumber === null) {
    return (
      <button type="button" disabled className={disabledClassName}>
        {content}
      </button>
    );
  }

  return (
    <Link href={`/q/${questionNumber}`} className={enabledClassName}>
      {content}
    </Link>
  );
};
