'use client';

import { Button } from '@/components/ui/button';
import { useCardBackPreview } from '@/lib/use-card-back-preview';
import type { CardBackContent } from '@/lib/card-back';
import { messages } from '@/lib/messages';

interface ImageGeneratorCardBackPreviewProps {
  content: CardBackContent;
  width: number;
  height: number;
  downloadName: string;
}

export const ImageGeneratorCardBackPreview = ({
  content,
  width,
  height,
  downloadName,
}: ImageGeneratorCardBackPreviewProps) => {
  const backUrl = useCardBackPreview({ content, width, height });
  if (!backUrl) return null;

  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backUrl}
        alt={messages.imageGenerator.cardBackPreviewAlt}
        className="max-w-full rounded-md border border-md-outline/20"
      />
      <Button asChild>
        <a href={backUrl} download={downloadName}>
          {messages.imageGenerator.downloadBack}
        </a>
      </Button>
    </div>
  );
};
