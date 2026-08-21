'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import type { Question, Topic } from '@/content';

interface NavTopicItemProps {
  topic: Topic;
  questions: Question[];
  /** Закрыть mobile-drawer после перехода по ссылке; no-op на desktop-панели. */
  onNavigate?: () => void;
}

/**
 * Один раздел оглавления: ссылка на `/topic/{id}` + отдельная кнопка-
 * раскрытие (аккордеон) вложенного списка вопросов раздела. Раскрытие по
 * умолчанию следует текущему маршруту (сам раздел или один из его
 * вопросов) — производная величина из `usePathname()`, пересчитывается на
 * каждый рендер без `useEffect` (hooks-and-state.md §2); явный клик по
 * кнопке-шеврону переопределяет её единственным `useState<boolean | null>`
 * (`null` = «следовать текущему маршруту», иначе — явный выбор пользователя).
 * Список вопросов рендерится всегда (не условно), видимость — через
 * `hidden`, чтобы `aria-controls` кнопки указывал на реально существующий
 * в DOM элемент независимо от состояния раскрытия.
 */
export const NavTopicItem = ({ topic, questions, onNavigate }: NavTopicItemProps) => {
  const pathname = usePathname();
  const isTopicActive = pathname === `/topic/${topic.topic_id}`;
  const isQuestionActive = questions.some((q) => pathname === `/q/${q.question_number}`);
  const isCurrent = isTopicActive || isQuestionActive;

  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);
  const isExpanded = manualExpanded ?? isCurrent;
  const questionsId = `topic-${topic.topic_id}-questions`;

  return (
    <li className="border-b border-md-outline/10 last:border-b-0">
      <div className="flex items-center">
        <Link
          href={`/topic/${topic.topic_id}`}
          onClick={onNavigate}
          aria-current={isTopicActive ? 'page' : undefined}
          className="flex min-h-[44px] flex-1 items-center px-4 py-2 text-left text-sm font-medium"
        >
          {topic.topic_name}
        </Link>
        <button
          type="button"
          onClick={() => setManualExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={questionsId}
          aria-label={
            isExpanded ? `Свернуть вопросы раздела «${topic.topic_name}»` : `Развернуть вопросы раздела «${topic.topic_name}»`
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <ul id={questionsId} className={isExpanded ? 'pb-1 pl-4' : 'hidden'}>
        {questions.map((question) => {
          const isQuestionCurrent = pathname === `/q/${question.question_number}`;
          return (
            <li key={question.question_number}>
              <Link
                href={`/q/${question.question_number}`}
                onClick={onNavigate}
                aria-current={isQuestionCurrent ? 'page' : undefined}
                className="flex min-h-[44px] items-center gap-2 px-4 py-2 text-sm"
              >
                <span className="shrink-0 text-md-outline">{question.question_number}.</span>
                <span className="truncate">{question.question_content}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
};
