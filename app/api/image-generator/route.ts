// Route Handler (не Server Action) для вызова внешнего image API — см.
// docs/conventions/data-routing-security.md §1. Node runtime: Vercel AI SDK
// использует Node API, не совместим с Edge.
//
// Origin не проверяется автоматически для Route Handler (в отличие от
// Server Actions), поэтому проверка ниже обязательна — см. §6 того же файла.
//
// GROK_API_KEY читается только в lib/image-generator-generate.ts, никогда не
// логируется и не попадает в ответ клиенту — см.
// docs/contracts/image-generator-api-contract.md §4. Это не то имя, которое
// @ai-sdk/xai ищет по умолчанию (XAI_API_KEY), поэтому провайдер создаётся
// явно с ключом.
//
// SECURITY_IMAGE_GENERATOR_KEY: `ImageGeneratorAccessGate` блокирует UI
// страницы, но сама по себе не защищает этот роут — запрос с правильным
// Origin можно отправить и в обход UI. Заголовок `x-image-generator-key`
// (тот же ключ, что уже введён на странице) обязателен здесь тоже —
// image-generator-tool-spec.md §6.

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { IMAGE_ASPECT_RATIO_VALUES } from '@/lib/image-generator-aspect-ratios';
import { getImageGeneratorAccessKey, secretsMatch } from '@/lib/image-generator-auth';
import {
  generateImageForModel,
  MissingProviderKeyError,
} from '@/lib/image-generator-generate';

export const runtime = 'nodejs';

const PROMPT_MAX_LENGTH = 4000;

const requestSchema = z.object({
  prompt: z
    .string({ error: 'Введите текст запроса.' })
    .trim()
    .min(1, 'Введите текст запроса.')
    .max(PROMPT_MAX_LENGTH, `Запрос слишком длинный (максимум ${PROMPT_MAX_LENGTH} символов).`),
  aspectRatio: z.enum(IMAGE_ASPECT_RATIO_VALUES, {
    error: 'Выберите допустимое соотношение сторон.',
  }),
});

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/** Origin должен совпадать с origin самого приложения — иначе 403 (CSRF). */
function hasValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  return origin !== null && origin === request.nextUrl.origin;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!hasValidOrigin(request)) {
    return errorResponse('Запрос отклонён: недопустимый источник.', 403);
  }

  const requiredKey = getImageGeneratorAccessKey();
  if (!requiredKey) {
    return errorResponse('Сервис генерации изображений временно недоступен.', 500);
  }
  const providedKey = request.headers.get('x-image-generator-key');
  if (!providedKey || !secretsMatch(providedKey, requiredKey)) {
    return errorResponse('Доступ запрещён. Обновите страницу и войдите заново.', 401);
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return errorResponse('Некорректное тело запроса.', 400);
  }

  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? 'Некорректный запрос.', 400);
  }
  const { prompt, aspectRatio } = parsed.data;

  try {
    const { image, estimatedCostUsd } = await generateImageForModel({
      prompt,
      aspectRatio,
    });
    return NextResponse.json({ image, estimatedCostUsd }, { status: 200 });
  } catch (error) {
    if (error instanceof MissingProviderKeyError) {
      return errorResponse('Сервис генерации изображений временно недоступен.', 500);
    }
    return errorResponse('Не удалось сгенерировать изображение. Попробуйте ещё раз.', 502);
  }
}
