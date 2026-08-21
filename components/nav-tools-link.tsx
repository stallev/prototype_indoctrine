'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { WandSparkles } from 'lucide-react';

import { messages } from '@/lib/messages';

interface NavToolsLinkProps {
  /** Закрыть mobile-drawer после перехода по ссылке; no-op на desktop-панели. */
  onNavigate?: () => void;
}

/**
 * Ссылка на самостоятельный инструмент генерации изображений
 * (`app/tools/image-generator`) — визуально отделена от списка разделов
 * катехизиса (не читает `content/*`, не часть `questionsForTopic`/`allTopics`).
 */
export const NavToolsLink = ({ onNavigate }: NavToolsLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === '/tools/image-generator';

  return (
    <div className="border-t border-md-outline/15 py-2">
      <Link
        href="/tools/image-generator"
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className="flex min-h-[44px] items-center gap-2 px-4 text-sm font-medium text-md-on-surface"
      >
        <WandSparkles aria-hidden="true" className="size-4 shrink-0 text-md-outline" />
        <span className="truncate">{messages.imageGenerator.heading}</span>
      </Link>
    </div>
  );
};
