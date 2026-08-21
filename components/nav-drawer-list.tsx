import type { Question, Topic } from '@/content';
import { NavTopicItem } from '@/components/nav-topic-item';

export interface TopicWithQuestions {
  topic: Topic;
  questions: Question[];
}

interface NavDrawerListProps {
  topics: TopicWithQuestions[];
  /** Закрыть mobile-drawer после перехода по ссылке; no-op на desktop-панели. */
  onNavigate?: () => void;
}

/** Список разделов оглавления (§7.2 `questionsForTopic`/`allTopics` уже отсортированы). */
export const NavDrawerList = ({ topics, onNavigate }: NavDrawerListProps) => (
  <ul className="pb-4">
    {topics.map(({ topic, questions }) => (
      <NavTopicItem key={topic.topic_id} topic={topic} questions={questions} onNavigate={onNavigate} />
    ))}
  </ul>
);
