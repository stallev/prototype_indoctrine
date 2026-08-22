'use client';

import { useEffect, useRef, useState } from 'react';

import { renderCardBack, type CardBackContent } from '@/lib/card-back';

interface UseCardBackPreviewOptions {
  content: CardBackContent;
  width: number;
  height: number;
}

/** Object URL оборота. Компонент монтируют только когда оборот нужен. */
export function useCardBackPreview({
  content,
  width,
  height,
}: UseCardBackPreviewOptions): string | null {
  const [url, setUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const blob = await renderCardBack({ content, width, height });
        if (cancelled) return;
        const next = URL.createObjectURL(blob);
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = next;
        setUrl(next);
      } catch {
        if (cancelled) return;
        if (urlRef.current) {
          URL.revokeObjectURL(urlRef.current);
          urlRef.current = null;
        }
        setUrl(null);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [content, width, height]);

  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, []);

  return url;
}
