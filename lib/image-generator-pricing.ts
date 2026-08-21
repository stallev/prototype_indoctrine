// Примерная себестоимость генерации — ориентир для UI, не фактический биллинг.
// Grok Imagine standard: flat $0.02 / image (docs.x.ai Imagine pricing).

export const GROK_IMAGINE_IMAGE_USD = 0.02;

export function estimateImageGenerationCostUsd(): number {
  return GROK_IMAGINE_IMAGE_USD;
}
