// Route Handler (не Server Action) для вызова внешнего Google API — см.
// docs/conventions/data-routing-security.md §1. Node runtime: Vercel AI SDK
// использует Node API, не совместим с Edge.
//
// Origin не проверяется автоматически для Route Handler (в отличие от
// Server Actions), поэтому проверка ниже обязательна — см. §6 того же файла.
//
// GEMINI_API_KEY читается только здесь, никогда не логируется и не попадает
// в ответ клиенту — см. docs/contracts/image-generator-api-contract.md §4.
// Это не то имя переменной, которое @ai-sdk/google ищет по умолчанию
// (GOOGLE_GENERATIVE_AI_API_KEY), поэтому провайдер создаётся явно с ключом.

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateImage } from 'ai';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

// Модель выбрана по открытому вопросу image-generator-tool-spec.md §7:
// Gemini 2.5 Flash Image, вызов через generateImage() (ai v7) +
// google.image() (@ai-sdk/google v4) — стабильный (не experimental_*) API
// для генерации изображений в установленных версиях пакетов.
const IMAGE_MODEL_ID = 'gemini-2.5-flash-image';

// Ограничение длины промпта — не зафиксировано провайдером, защита от
// чрезмерно больших запросов (image-generator-api-contract.md §1).
const PROMPT_MAX_LENGTH = 1000;

const requestSchema = z.object({
  prompt: z
    .string({ error: 'Введите текст запроса.' })
    .trim()
    .min(1, 'Введите текст запроса.')
    .max(PROMPT_MAX_LENGTH, `Запрос слишком длинный (максимум ${PROMPT_MAX_LENGTH} символов).`),
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
  const { prompt } = parsed.data;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Ошибка конфигурации сервера — не должна быть достижима в норме
    // (ключ уже есть в .env). Не раскрывать детали клиенту.
    return errorResponse('Сервис генерации изображений временно недоступен.', 500);
  }

  const google = createGoogleGenerativeAI({ apiKey });

  try {
    const result = await generateImage({
      model: google.image(IMAGE_MODEL_ID),
      prompt,
    });
    const { base64, mediaType } = result.image;
    return NextResponse.json({ image: `data:${mediaType};base64,${base64}` }, { status: 200 });
  } catch {
    // Ошибки провайдера (лимиты, недоступность, отклонённый промпт) не
    // пробрасываются клиенту как есть — только понятное сообщение, без
    // стектрейса/деталей провайдера и без значения ключа.
    return errorResponse('Не удалось сгенерировать изображение. Попробуйте ещё раз.', 502);
  }
}
