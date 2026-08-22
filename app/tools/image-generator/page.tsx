// Самостоятельный инструмент (image-generator-tool-spec.md §2) — не читает
// content/*.ts. Тонкая композиция (data-routing-security.md §3): сам page.tsx
// остаётся Server Component, клиентские "листья" — ImageGeneratorAccessGate
// (проверка доступа) и вложенная в неё ImageGeneratorForm (сама генерация).

import type { Metadata } from 'next';

import { ImageGeneratorAccessGate } from '@/components/image-generator-access-gate';
import { ImageGeneratorForm } from '@/components/image-generator-form';
import { messages } from '@/lib/messages';
import { imageGeneratorPageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = imageGeneratorPageMetadata();

export default function ImageGeneratorPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:max-w-3xl md:p-8">
      <h1 className="text-xl font-semibold text-md-on-surface md:text-2xl">{messages.imageGenerator.heading}</h1>
      <ImageGeneratorAccessGate>
        <ImageGeneratorForm />
      </ImageGeneratorAccessGate>
    </main>
  );
}
