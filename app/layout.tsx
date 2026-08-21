import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

// Same typeface as the accepted static prototype (styles/input.css
// `--font-sans: "Roboto", ...`) — loaded via next/font so it's actually
// fetched/self-hosted, not just referenced as a CSS font-family string.
const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Моя первая книга вопросов и ответов',
  description: 'Катехизис Кэрин Маккензи — 114 вопросов и ответов.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={roboto.variable}>
      <body>{children}</body>
    </html>
  );
}
