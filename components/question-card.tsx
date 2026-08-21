import Link from 'next/link';

import type { Verse } from '@/content';
import { Illustration } from '@/components/illustration';
import { VerseBlock } from '@/components/verse-block';

interface QuestionCardProps {
  questionNumber: number;
  questionContent: string;
  answer: string;
  topicId: number;
  topicName: string;
  verses: Verse[];
}

/**
 * Карточка вопроса — обязательные блоки 1–5 страницы вопроса
 * (static-prototype-spec.md §7.4): иллюстрация, метка раздела, заголовок
 * (единственный h1 страницы), ответ, список стихов (пропускается при
 * `verses.length === 0`, см. VerseBlock для правил самого стиха).
 *
 * Иллюстрация — на весь верх карточки (аспект 4:3, см. illustration.tsx),
 * без старого двухколоночного split-макета: components/illustration.tsx
 * (принято в 9.2.4) рендерит фиксированный aspect-[4/3] w-full без
 * растяжения на всю высоту колонки, поэтому левая/правая колонка не даёт
 * визуального эффекта старого прототипа — задокументированное расхождение
 * (copy-icons-fidelity.md §3), решено в пользу контракта illustration.tsx.
 */
export const QuestionCard = ({
  questionNumber,
  questionContent,
  answer,
  topicId,
  topicName,
  verses,
}: QuestionCardProps) => (
  <article className="overflow-hidden rounded-lg bg-md-surface-container shadow-e1">
    <Illustration questionNumber={questionNumber} questionContent={questionContent} />

    <div className="p-4 md:p-8 lg:p-10">
      <Link
        href={`/topic/${topicId}`}
        className="inline-block w-fit rounded-full bg-md-secondary/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-md-secondary transition-colors hover:bg-md-secondary/25 md:text-sm"
      >
        {topicName}
      </Link>

      <h1 className="mt-3 text-xl font-medium leading-snug md:text-3xl lg:text-4xl">
        {questionNumber}. {questionContent}
      </h1>

      <p className="mt-3 text-base leading-relaxed md:text-xl lg:text-2xl">{answer}</p>

      {verses.length > 0 && (
        <ul className="mt-4 space-y-3 border-t border-md-outline/15 pt-4 md:mt-6 md:space-y-4 md:pt-6">
          {verses.map((verse) => (
            <VerseBlock key={verse.id} verse={verse} />
          ))}
        </ul>
      )}
    </div>
  </article>
);
