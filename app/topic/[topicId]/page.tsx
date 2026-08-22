import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TOPICS } from '@/content/topics';
import { getTopic, questionsForTopic } from '@/content';
import { TopicQuestionList } from '@/components/topic-question-list';
import { topicPageMetadata } from '@/lib/page-metadata';

interface TopicPageProps {
  params: Promise<{ topicId: string }>;
}

/** 16 статических параметров — выведено из content/topics.ts. */
export function generateStaticParams() {
  return TOPICS.map((topic) => ({ topicId: String(topic.topic_id) }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicId } = await params;
  return topicPageMetadata(Number(topicId)) ?? {};
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicId } = await params;
  const id = Number(topicId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const topic = getTopic(id);
  if (!topic) {
    notFound();
  }

  const questions = questionsForTopic(id);

  return (
    <main className="mx-auto max-w-2xl p-4 md:max-w-3xl md:p-8 lg:max-w-4xl">
      <h1 className="mb-4 text-xl font-medium">{topic.topic_name}</h1>
      <TopicQuestionList questions={questions} />
    </main>
  );
}
