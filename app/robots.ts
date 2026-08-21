import type { MetadataRoute } from 'next';

// Прототип не предназначен для публичной индексации (по запросу пользователя,
// 2026-08-21) — запрещаем всем ботам весь сайт. Дублирует meta robots в
// app/layout.tsx (robots.txt блокирует краулинг, meta-тег — попадание в
// индекс даже по внешней ссылке без краулинга).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
