import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type { Question } from '@/content';

interface TopicQuestionListProps {
  questions: Question[];
}

/**
 * Компактный список вопросов раздела (страница `/topic/[topicId]`) — не
 * карточка вопроса (question-card.tsx): только номер + текст вопроса, без
 * ответа/иллюстрации/стихов. Порядок — как передано в props; вызывающая
 * страница получает вопросы уже отсортированными по `question_number` из
 * `questionsForTopic` (content/index.ts), повторной сортировки здесь нет.
 * Разметка пункта — порт `createDrillItem`/`createDrillList` из старого
 * `js/app.js` (`renderTopic`): круглый бейдж с номером, усечённый текст,
 * chevron.
 */
export const TopicQuestionList = ({ questions }: TopicQuestionListProps) => (
  <ul className="overflow-hidden rounded-lg bg-md-surface-container shadow-e1">
    {questions.map((question) => (
      <li key={question.question_number} className="border-b border-md-outline/15 last:border-b-0">
        <Link
          href={`/q/${question.question_number}`}
          className="flex min-h-[56px] items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-md-surface-tint/25 focus-visible:bg-md-surface-tint/25 focus-visible:outline-none"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-md-primary/10 text-sm font-medium text-md-primary">
              {question.question_number}
            </span>
            <span className="truncate">{question.question_content}</span>
          </span>
          <ChevronRight aria-hidden="true" className="size-[18px] shrink-0 text-md-outline" />
        </Link>
      </li>
    ))}
  </ul>
);
