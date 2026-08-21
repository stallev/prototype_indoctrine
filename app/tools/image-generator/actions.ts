'use server';

// Server Action (не Route Handler) — проверка ключа доступа к UI: чистая
// внутренняя валидация без внешнего side-эффекта, Next.js даёт встроенную
// защиту от CSRF автоматически (data-routing-security.md §1). Значение
// SECURITY_IMAGE_GENERATOR_KEY никогда не покидает сервер — клиент получает
// только boolean.

import { getImageGeneratorAccessKey, secretsMatch } from '@/lib/image-generator-auth';

export async function verifyImageGeneratorKey(candidate: string): Promise<boolean> {
  const expected = getImageGeneratorAccessKey();
  if (!expected || candidate.length === 0) return false;
  return secretsMatch(candidate, expected);
}
