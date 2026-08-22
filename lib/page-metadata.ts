import type { Metadata } from 'next';

import { getQuestionWithVerses, getTopic, questionsForTopic } from '@/content';
import { messages } from '@/lib/messages';

const DESCRIPTION_MAX_LENGTH = 160;
const OG_IMAGE = {
  url: '/images/og-image.svg',
  width: 1200,
  height: 630,
  alt: messages.seo.ogImageAlt,
} as const;

export function siteMetadataBase(): URL {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(host ? `https://${host}` : 'http://localhost:3000');
}

function truncateDescription(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= DESCRIPTION_MAX_LENGTH) return trimmed;
  return `${trimmed.slice(0, DESCRIPTION_MAX_LENGTH - 1).trimEnd()}…`;
}

function questionCountLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} вопрос`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} вопроса`;
  return `${count} вопросов`;
}

function pageMetadata(params: {
  title: string;
  description: string;
  path?: string;
  titleAbsolute?: boolean;
}): Metadata {
  const { title, description, path, titleAbsolute } = params;
  const ogTitle = titleAbsolute ? title : `${title} — ${messages.seo.siteName}`;
  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title: ogTitle,
      description,
      locale: 'ru_RU',
      type: 'website',
      siteName: messages.seo.siteName,
      images: [OG_IMAGE],
      ...(path ? { url: path } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export function homePageMetadata(): Metadata {
  return pageMetadata({
    title: messages.seo.siteName,
    description: messages.seo.siteDescription,
    path: '/',
    titleAbsolute: true,
  });
}

export function questionPageMetadata(questionNumber: number): Metadata | undefined {
  const question = getQuestionWithVerses(questionNumber);
  if (!question) return undefined;
  return pageMetadata({
    title: `${question.question_number}. ${question.question_content}`,
    description: truncateDescription(question.answer),
    path: `/q/${question.question_number}`,
  });
}

export function topicPageMetadata(topicId: number): Metadata | undefined {
  const topic = getTopic(topicId);
  if (!topic) return undefined;
  const count = questionsForTopic(topicId).length;
  return pageMetadata({
    title: topic.topic_name,
    description: messages.seo.topicDescription(topic.topic_name, questionCountLabel(count)),
    path: `/topic/${topic.topic_id}`,
  });
}

export function imageGeneratorPageMetadata(): Metadata {
  return pageMetadata({
    title: messages.imageGenerator.heading,
    description: messages.seo.imageGeneratorDescription,
    path: '/tools/image-generator',
  });
}

export function notFoundPageMetadata(): Metadata {
  return pageMetadata({
    title: messages.error.notFoundTitle,
    description: messages.error.notFoundDescription,
    titleAbsolute: true,
  });
}
