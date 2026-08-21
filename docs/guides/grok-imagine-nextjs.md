# Grok Imagine в Next.js

Краткое руководство, как вызвать **xAI Grok Imagine** из App Router и отдать картинку клиенту. Стек проверен в этом репозитории: Next.js 16 App Router, `ai` v7, `@ai-sdk/xai` v4.

Официально: [Imagine](https://docs.x.ai/developers/model-capabilities/imagine), модель [`grok-imagine-image`](https://docs.x.ai/developers/models/grok-imagine-image). AI SDK: [`generateImage`](https://ai-sdk.dev/docs/ai-sdk-core/image-generation).

## Что ставить

```bash
npm i ai @ai-sdk/xai server-only zod
```

| Пакет | Роль |
|---|---|
| `ai` | стабильный `generateImage` (не `experimental_generateImage`) |
| `@ai-sdk/xai` | `createXai` + `xai.image(...)` |
| `server-only` | ключ и вызов API только на сервере |
| `zod` | валидация тела запроса до вызова xAI |

Ключ берётся на [console.x.ai](https://console.x.ai/). Ориентир цены standard: **$0.02 / картинка** (flat). `size` у Grok **нет** — только `aspectRatio`.

## Переменные окружения

SDK по умолчанию читает `XAI_API_KEY`. Если в проекте другое имя — передавайте ключ явно.

```env
GROK_API_KEY=
```

На Vercel: Project → Settings → Environment Variables, те же имена для Production / Preview. Значение не логировать и не отдавать в клиентский бандл.

Опционально отдельный ключ доступа к UI/роуту (не ключ xAI), если инструмент не должен быть публичным.

## Вызов модели (сервер)

`lib/generate-image.ts` — единственное место, где читается `GROK_API_KEY`. Runtime: **Node**, не Edge (AI SDK использует Node API).

```ts
import 'server-only';

import { createXai } from '@ai-sdk/xai';
import { generateImage } from 'ai';

const GROK_IMAGE_MODEL_ID = 'grok-imagine-image';

const GROK_ASPECT_RATIOS = [
  '1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3',
  '2:1', '1:2', '19.5:9', '9:19.5', '20:9', '9:20',
] as const;

export type GrokAspectRatio = (typeof GROK_ASPECT_RATIOS)[number];

export async function generateGrokImage(params: {
  prompt: string;
  aspectRatio: GrokAspectRatio;
}): Promise<{ dataUrl: string }> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new Error('missing-grok-api-key');

  const xai = createXai({ apiKey });
  const { image } = await generateImage({
    model: xai.image(GROK_IMAGE_MODEL_ID),
    prompt: params.prompt,
    aspectRatio: params.aspectRatio,
  });

  // xAI просит response_format: b64_json; если base64 нет, SDK скачивает URL сам
  return { dataUrl: `data:${image.mediaType};base64,${image.base64}` };
}
```

Без `aspectRatio` провайдер обычно даёт кадр около **1:1**. Продуктовые соотношения, которых нет в списке, маппьте на ближайшее (например `21:9` → `20:9`, `5:4` → `4:3`).

## Route Handler

Внешний API — **Route Handler**, не Server Action: у Action нет простого таймаута/статуса, а CSRF для Route Handler нужно проверить самим (`Origin` = origin приложения).

```ts
// app/api/image-generator/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { generateGrokImage } from '@/lib/generate-image';

export const runtime = 'nodejs';

const schema = z.object({
  prompt: z.string().trim().min(1).max(4000),
  aspectRatio: z.enum([
    '1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3',
    '2:1', '1:2', '19.5:9', '9:19.5', '20:9', '9:20',
  ]),
});

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const { dataUrl } = await generateGrokImage(parsed.data);
    return NextResponse.json({ image: dataUrl });
  } catch {
    return NextResponse.json({ error: 'Generation failed' }, { status: 502 });
  }
}
```

Порядок проверок: Origin → (опционально ключ доступа) → zod → xAI. Ошибки клиенту — короткое сообщение, без стека и тела ответа провайдера.

Если роут закрываете своим секретом: заголовок вроде `x-image-generator-key`, сравнение через `crypto.timingSafeEqual` (по хэшам SHA-256), не `===`. UI-gate сам по себе роут не защищает.

## Клиент

```ts
const res = await fetch('/api/image-generator', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, aspectRatio }),
});
const data = await res.json();
if (!res.ok) throw new Error(data.error ?? 'Generation failed');

// data.image — data URL. Скачивание только по клику пользователя:
const a = document.createElement('a');
a.href = data.image;
a.download = 'image.png';
a.click();
```

Показ: `<img src={data.image} alt="" />`. Автоскачивание при ответе не делать.

## Промпты и ограничения

- Промпт на **английском** обычно стабильнее; кириллица **внутри картинки** у диффузионных моделей ненадёжна — текст лучше накладывать после (Canvas / SVG).
- Стиль задавайте в промпте явно (photo / illustration / lighting / lens). Grok Imagine хорошо держит живописный и «тёплый» стиль.
- Длина промпта ограничьте на сервере (здесь 4000 символов хватает на развёрнутые сцены).
- Модерация xAI своя: отказ провайдера отдавайте как 502 с нейтральным текстом.

## Чеклист в новом проекте

1. `GROK_API_KEY` только в server-модуле через `createXai({ apiKey })`.
2. `export const runtime = 'nodejs'` на роуте.
3. `aspectRatio` из allowlist Grok; `size` не передавать.
4. Ответ — data URL; ключ xAI не светится в `.next/static`.
5. На Vercel: обычный Node-деплой (`next build`), не `output: 'export'` — нужен Route Handler.
