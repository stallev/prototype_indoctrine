import 'server-only';

import { createXai } from '@ai-sdk/xai';
import { generateImage } from 'ai';

import {
  toProviderAspectRatio,
  type ImageAspectRatio,
} from '@/lib/image-generator-aspect-ratios';
import { GROK_IMAGE_MODEL_ID } from '@/lib/image-generator-models';
import { estimateImageGenerationCostUsd } from '@/lib/image-generator-pricing';

export class MissingProviderKeyError extends Error {
  constructor() {
    super('missing-provider-key');
    this.name = 'MissingProviderKeyError';
  }
}

function generatedFileToDataUrl(image: {
  base64: string;
  mediaType: string;
}): string {
  return `data:${image.mediaType};base64,${image.base64}`;
}

export async function generateImageForModel(params: {
  prompt: string;
  aspectRatio: ImageAspectRatio;
}): Promise<{ image: string; estimatedCostUsd: number }> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new MissingProviderKeyError();

  const xai = createXai({ apiKey });
  const result = await generateImage({
    model: xai.image(GROK_IMAGE_MODEL_ID),
    prompt: params.prompt,
    aspectRatio: toProviderAspectRatio(params.aspectRatio),
  });
  return {
    image: generatedFileToDataUrl(result.image),
    estimatedCostUsd: estimateImageGenerationCostUsd(),
  };
}
