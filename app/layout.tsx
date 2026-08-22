import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

import { allTopics, questionsForTopic } from '@/content';
import { NavDrawer } from '@/components/nav-drawer';
import { messages } from '@/lib/messages';
import { siteMetadataBase } from '@/lib/page-metadata';

// Same typeface as the accepted static prototype (styles/input.css
// `--font-sans: "Roboto", ...`) — loaded via next/font so it's actually
// fetched/self-hosted, not just referenced as a CSS font-family string.
const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: siteMetadataBase(),
  title: {
    default: messages.seo.siteName,
    template: `%s — ${messages.seo.siteName}`,
  },
  description: messages.seo.siteDescription,
  // Прототип закрыт от индексации (по запросу пользователя, 2026-08-21) —
  // дублирует app/robots.ts на уровне meta-тега каждой страницы.
  robots: { index: false, follow: false },
  icons: { icon: '/images/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: messages.seo.siteName,
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: messages.seo.ogImageAlt,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Топики + вложенные вопросы для оглавления (components/nav-drawer.tsx) —
  // читаются здесь (Server Component, синхронный доступ к content/*.ts, не
  // fetch/useEffect) и передаются вниз как serializable props, см.
  // components.md §3 ("данные вычисляются на сервере, передаются как props").
  const topics = allTopics().map((topic) => ({
    topic,
    questions: questionsForTopic(topic.topic_id),
  }));

  return (
    <html lang="ru" className={roboto.variable}>
      <body className="font-sans antialiased">
        <NavDrawer topics={topics}>{children}</NavDrawer>
      </body>
    </html>
  );
}
