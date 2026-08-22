import type { Metadata } from 'next';
import Link from 'next/link';

import { messages } from '@/lib/messages';
import { notFoundPageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = notFoundPageMetadata();

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:max-w-3xl md:p-8 lg:max-w-4xl">
      <h1 className="text-xl font-semibold text-md-on-surface">{messages.error.notFoundTitle}</h1>
      <p className="mt-2 text-md-on-surface">{messages.error.notFoundDescription}</p>
      <Link
        href="/q/1"
        className="mt-4 inline-block text-sm font-medium text-md-primary transition-colors hover:underline md:text-base"
      >
        {messages.nav.home}
      </Link>
    </main>
  );
}
