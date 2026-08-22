import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { homePageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = homePageMetadata();

export default function Home() {
  redirect('/q/1');
}
