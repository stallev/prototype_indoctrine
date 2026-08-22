// Тонкая композиция (data-routing-security.md §3): page.tsx читает content
// и передаёт compact backCards вниз. Клиентская форма content/* не импортирует.

import type { Metadata } from 'next';

import { ImageGeneratorAccessGate } from '@/components/image-generator-access-gate';
import { ImageGeneratorForm } from '@/components/image-generator-form';
import { getQuestionWithVerses } from '@/content';
import { QUESTIONS } from '@/content/questions';
import type { CardBackContent } from '@/lib/card-back';
import { messages } from '@/lib/messages';
import { imageGeneratorPageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = imageGeneratorPageMetadata();

function cardBacksByQuestion(): Record<string, CardBackContent> {
  const cards: Record<string, CardBackContent> = {};
  for (const row of QUESTIONS) {
    const question = getQuestionWithVerses(row.question_number);
    if (!question) continue;
    const first = question.verses[0];
    cards[String(question.question_number)] = {
      answer: question.answer,
      verse: first ? { reference: first.reference, text: first.text } : null,
    };
  }
  return cards;
}

export default function ImageGeneratorPage() {
  const backCards = cardBacksByQuestion();

  return (
    <main className="mx-auto max-w-2xl p-4 md:max-w-3xl md:p-8">
      <h1 className="text-xl font-semibold text-md-on-surface md:text-2xl">{messages.imageGenerator.heading}</h1>
      <ImageGeneratorAccessGate>
        <ImageGeneratorForm backCards={backCards} />
      </ImageGeneratorAccessGate>
    </main>
  );
}
