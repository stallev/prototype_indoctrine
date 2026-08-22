import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { QUESTIONS } from '@/content/questions';
import { getQuestionWithVerses, getTopic } from '@/content';
import { QuestionCard } from '@/components/question-card';
import { QuestionNavLink } from '@/components/question-nav-link';
import { messages } from '@/lib/messages';
import { questionPageMetadata } from '@/lib/page-metadata';

const QUESTION_COUNT = QUESTIONS.length;

interface QuestionPageProps {
  params: Promise<{ number: string }>;
}

/** 114 статических параметров (1…114) — выведено из content/questions.ts. */
export function generateStaticParams() {
  return QUESTIONS.map((question) => ({ number: String(question.question_number) }));
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { number } = await params;
  return questionPageMetadata(Number(number)) ?? {};
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { number } = await params;
  const questionNumber = Number(number);

  if (!Number.isInteger(questionNumber) || questionNumber < 1 || questionNumber > QUESTION_COUNT) {
    notFound();
  }

  const question = getQuestionWithVerses(questionNumber);
  if (!question) {
    notFound();
  }

  const topic = getTopic(question.topic_id);
  const prevNumber = questionNumber > 1 ? questionNumber - 1 : null;
  const nextNumber = questionNumber < QUESTION_COUNT ? questionNumber + 1 : null;

  return (
    <main className="mx-auto max-w-2xl p-4 md:max-w-3xl md:p-8 lg:max-w-4xl">
      <QuestionCard
        questionNumber={question.question_number}
        questionContent={question.question_content}
        answer={question.answer}
        topicId={question.topic_id}
        topicName={topic?.topic_name ?? ''}
        verses={question.verses}
      />

      <nav
        aria-label="Навигация по вопросам"
        className="mt-6 flex items-center justify-between gap-3 md:mt-8"
      >
        <QuestionNavLink questionNumber={prevNumber} label={messages.nav.prev} direction="prev" />
        <Link
          href={`/topic/${question.topic_id}`}
          className="text-sm font-medium text-md-primary transition-colors hover:underline md:text-base"
        >
          {messages.nav.toTopic}
        </Link>
        <QuestionNavLink questionNumber={nextNumber} label={messages.nav.next} direction="next" />
      </nav>
    </main>
  );
}
