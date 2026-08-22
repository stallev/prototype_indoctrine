'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { messages } from '@/lib/messages';

interface ImageGeneratorResultPreviewsProps {
  frontUrl: string | null;
  frontCostUsd: number | null;
  frontDownloadName: string;
  frontDownloadLabel: string;
  children?: ReactNode;
}

export const ImageGeneratorResultPreviews = ({
  frontUrl,
  frontCostUsd,
  frontDownloadName,
  frontDownloadLabel,
  children,
}: ImageGeneratorResultPreviewsProps) => {
  if (!frontUrl && !children) return null;

  return (
    <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
      {frontUrl ? (
        <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
          {/* Blob URL только в этой вкладке — next/image не подходит. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frontUrl}
            alt={messages.imageGenerator.previewAlt}
            className="max-w-full rounded-md border border-md-outline/20"
          />
          {frontCostUsd !== null ? (
            <>
              <p className="text-sm text-md-on-surface">
                {messages.imageGenerator.estimatedCost(frontCostUsd.toFixed(4))}
              </p>
              <p className="max-w-prose text-xs text-md-outline">
                {messages.imageGenerator.estimatedCostNote}
              </p>
            </>
          ) : null}
          <Button asChild>
            <a href={frontUrl} download={frontDownloadName}>
              {frontDownloadLabel}
            </a>
          </Button>
        </div>
      ) : null}
      {children}
    </div>
  );
};
