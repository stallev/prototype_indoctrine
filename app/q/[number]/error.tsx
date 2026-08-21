'use client';

import { Button } from '@/components/ui/button';
import { messages } from '@/lib/messages';

interface QuestionErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary для сегмента `app/q/[number]/` — только непредвиденные ошибки
 * рендера (например, если `getQuestionWithVerses` неожиданно бросит исключение).
 * Не путать с `notFound()` в `page.tsx` — это отдельный, штатный путь для
 * несуществующих номеров вопросов.
 */
export default function QuestionError({ reset }: QuestionErrorProps) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-4 md:max-w-3xl md:p-8 lg:max-w-4xl">
      <h1 className="text-xl font-semibold text-md-on-surface">{messages.error.title}</h1>
      <Button type="button" onClick={reset}>
        {messages.error.retry}
      </Button>
    </main>
  );
}
