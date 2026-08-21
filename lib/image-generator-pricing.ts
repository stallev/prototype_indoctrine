// Примерная себестоимость генерации для gemini-2.5-flash-image (Paid tier).
// Источник: https://ai.google.dev/gemini-api/docs/pricing
// — output images up to 1024×1024 → 1290 tokens @ $30 / 1M = $0.039 / image;
// — text/image input @ $0.30 / 1M tokens.
// Это ориентир для UI, не фактический биллинг Google.

export const GEMINI_FLASH_IMAGE_OUTPUT_USD = 0.039;
export const GEMINI_FLASH_IMAGE_INPUT_USD_PER_MILLION = 0.3;

/** Грубая оценка токенов промпта (~4 символа / токен). */
function estimateInputTokens(prompt: string): number {
  return Math.max(1, Math.ceil(prompt.length / 4));
}

/** Примерная себестоимость одного вызова generateImage в USD. */
export function estimateImageGenerationCostUsd(prompt: string): number {
  const inputCost =
    (estimateInputTokens(prompt) / 1_000_000) * GEMINI_FLASH_IMAGE_INPUT_USD_PER_MILLION;
  return inputCost + GEMINI_FLASH_IMAGE_OUTPUT_USD;
}
