'use client';

import { Button } from '@/components/ui/button';
import { messages } from '@/lib/messages';

interface TopicErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary для сегмента `app/topic/[topicId]/` — только непредвиденные
 * ошибки рендера (например, если `questionsForTopic` неожиданно бросит
 * исключение). Не путать с `notFound()` в `page.tsx` — это отдельный,
 * штатный путь для несуществующих разделов.
 */
export default function TopicError({ reset }: TopicErrorProps) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-4 md:max-w-3xl md:p-8 lg:max-w-4xl">
      <h1 className="text-xl font-semibold text-md-on-surface">{messages.error.title}</h1>
      <Button type="button" onClick={reset}>
        {messages.error.retry}
      </Button>
    </main>
  );
}
