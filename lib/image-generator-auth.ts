import 'server-only';

// Timing-safe сравнение секретов постоянной длины — используется и Server
// Action'ом проверки ключа доступа (app/tools/image-generator/actions.ts),
// и Route Handler'ом генерации (app/api/image-generator/route.ts), чтобы обе
// проверки не разошлись. SHA-256 приводит оба значения к фиксированной
// длине до сравнения — это убирает утечку через ранний выход по длине,
// на которую `crypto.timingSafeEqual` иначе бросил бы исключение.

import { createHash, timingSafeEqual } from 'node:crypto';

function hash(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

export function secretsMatch(a: string, b: string): boolean {
  return timingSafeEqual(hash(a), hash(b));
}

/** `SECURITY_IMAGE_GENERATOR_KEY` — ключ доступа к UI/API инструмента генерации изображений (не GEMINI_API_KEY). */
export function getImageGeneratorAccessKey(): string | undefined {
  return process.env.SECURITY_IMAGE_GENERATOR_KEY;
}
