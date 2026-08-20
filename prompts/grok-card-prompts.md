# Промпты для Grok Imagine — печатные карточки катехизиса (A6)

Для ручной генерации в Grok Imagine, по одному промпту за раз. Каждый промпт — только
лицевая сторона карточки (иллюстрация); оборот (ответ + стих на цветной подложке, без
иллюстрации) в этот файл не входит — вёрстка обеих сторон делается отдельным, ещё не
спроектированным шагом (наложение текста и печатной подложки поверх сгенерированного
изображения, не самим Grok).

**Печатные параметры (справочно, не гарантия точного вывода Grok):**
A6, портрет, 105×148 мм; вылет под обрез ~3 мм (итого ~111×154 мм); ориентир разрешения
под печать 300dpi — ~1240×1748 px по обрезу / ~1311×1819 px с вылетом. Точную подгонку
размера/обреза делает следующий, отдельный шаг вёрстки — не сама генерация в Grok.

**Стиль:** свободная живописная палитра (не связана с фиксированной hex-палитрой сайта
из `specs/svg-illustration-spec.md` §3) — печатная колода намеренно развязана визуально
с SVG-иллюстрациями сайта.
**Язык промптов:** английский (диффузионные модели, включая Grok, в среднем точнее следуют
промптам на английском).
**Формат записи:** каждый из 114 промптов самодостаточен — полностью дублирует жёсткие
правила и запрет текста, чтобы промпт можно было скопировать в Grok по одному, ничего не
потеряв из общих ограничений.
**Текст на карточке (вторая итерация формата, после двух неудачных попыток):**
1. Первая версия промпта (длинная проза: рамка + жёсткие правила + стиль отдельными
   абзацами) заставила Grok напечатать куски самого промпта, включая абзац правил, как
   нечитаемый текст поверх картинки.
2. Вторая версия сократила абзацы и явно попросила «не печатай инструкции как текст» —
   не помогло: Grok всё равно напечатал огрызки английской прозы («No visible figue or
   God...»), хоть заголовок на русском при этом уже центрировался верно.
3. Текущая (третья) версия — это ровно **два** поля на промпт, оба короткие и не похожие
   на «абзац текста»: «Text: "N. Вопрос"» — идёт первым, с жёстким требованием (по словам
   пользователя) единственного текста в кадре, отцентрированного и по горизонтали, и по
   вертикали; «Scene: ...» — одно предложение сцены с доктринальными ограничениями,
   свёрнутыми в короткие хвостовые фразы того же предложения, а не отдельным абзацем
   правил. Гипотеза: чем длиннее и «прозаичнее» текст в промпте, тем охотнее Grok решает,
   что это и есть подпись для карточки, а не инструкция — поэтому убраны все
   многопредложенческие блоки, а не только их формулировка.

Эта гипотеза не проверена мной напрямую (нет доступа к Grok из этой сессии) — если текст
всё ещё просачивается и на этой версии, следующий шаг — полностью убрать доктринальные
правила и стиль из текста промпта и переносить весь текст карточки (номер+вопрос) отдельным
наложением поверх уже готовой чистой иллюстрации, а не просить Grok рисовать текст вообще.

Диффузионные модели, включая Grok, всё равно ненадёжно рендерят кириллицу и позиционирование —
каждую сгенерированную карточку нужно проверять глазами и при необходимости перегенерировать.

**Внешность и одежда:** требование строгого соответствия консервативной христианской традиции
явно прописано в каждом промпте (в поле `Scene:`) отдельно для женщин/девочек и мужчин/мальчиков —
одежда (платье/юбка ниже колена, длинный рукав, закрытый вырез, без брюк/шорт у женщин; полностью
закрытая одежда без открытого торса у мужчин) и причёска (длинные, аккуратно убранные или покрытые
волосы у женщин; короткая аккуратная стрижка у мужчин). Сформулировано короткими фразами внутри
того же предложения сцены, а не отдельным абзацем — по той же причине, что и выше.

Источник сюжета (`scene_brief`) для каждого вопроса — `prompts/illustration-prompts.ts`;
русская подсказка сцены переработана в развёрнутое английское диффузионное описание (не
дословный перевод). Доктринальные ограничения — `specs/svg-illustration-spec.md` §2/§7;
таблица чувствительных вопросов (§7) требует повышенной проверки для номеров:
1, 4, 43–52, 58–61, 107 (Божество); 24–27, 31, 35–37 (Адам и Ева); 41–42, 91, 111–112
(гнев/ад); 108 (суд); 109–110 (смерть/воскресение); 62, 69–70, 73–74 (заповеди/скрижали);
97–101 (крещение/вечеря); 113–114 (рай).

---

## Раздел 1. Бог

### Вопрос 1. Кто тебя сотворил?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "1. Кто тебя сотворил?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Two children stand in a blooming meadow under a warm sky, soft golden sunbeams breaking through light clouds, a tender and peaceful mood. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 2. Для чего Бог сотворил тебя?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "2. Для чего Бог сотворил тебя?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child stands with arms raised joyfully toward a soft sunrise sky, surrounded by blooming wildflowers and a warm glow of golden light. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 3. Что еще сотворил Бог?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "3. Что еще сотворил Бог?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A rich tapestry of creation: rolling mountains, a green forest, a calm sea, birds soaring and animals grazing beneath a vast warm sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 4. Для чего Бог сотворил все?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "4. Для чего Бог сотворил все?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A sweeping panorama of creation — rolling hills, a lush forest, birds in flight, all bathed in warm golden light. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 5. Где Бог учит нас прославлять Его и наслаждаться Им?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "5. Где Бог учит нас прославлять Его и наслаждаться Им?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A boy sits beneath a large shade tree on a gentle hillside, reading an open Bible, soft afternoon light filtering through the leaves. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 6. Кто написал Библию?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "6. Кто написал Библию?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An open Bible rests on a smooth stone, gentle light falling softly from above onto its pages. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 7. Кто есть Бог?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "7. Кто есть Бог?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A luminous sky filled with soft golden rays breaking through gentle clouds — no figures, just warm radiant light. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 8. Кто такой дух?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "8. Кто такой дух?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A soft, glowing cloud-like radiance drifting gently in the sky, formless and faceless, warm and soft-edged. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 9. Где находится Бог?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "9. Где находится Бог?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child stands atop a hill gazing out at endless sky, sea, and land stretching to the horizon, warm light all around. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 10. Было ли у Бога начало?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "10. Было ли у Бога начало?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A quiet range of hills beneath a star-filled dawn sky, calm and timeless, evoking eternity without beginning. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 11. Будет ли у Бога конец?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "11. Будет ли у Бога конец?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: The same peaceful landscape at dusk, soft starlight glowing evenly across the hills — eternity without end. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 12. Изменяется ли Бог?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "12. Изменяется ли Бог?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A smooth rock on a seashore, gentle waves lapping softly against it, steady and unchanging. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 13. Знает ли Бог все?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "13. Знает ли Бог все?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An open book lying beneath a single soft beam of light, symbolizing all-knowing wisdom. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 14. Все ли Бог может?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "14. Все ли Бог может?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Majestic mountains and a calm sea beneath a vast, clear sky, conveying quiet grandeur and power. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 15. Можешь ли ты увидеть Бога?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "15. Можешь ли ты увидеть Бога?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A boy stands with eyes closed, hands folded in prayer, face turned gently upward toward the sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 16. Сколько есть Богов?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "16. Сколько есть Богов?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A single bright beam of light breaking through soft clouds above one lone tree in an open field. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 17. Сколько личностей существует в Боге?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "17. Сколько личностей существует в Боге?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Three identical soft beams of light converging gently at one point in the sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 18. Кто эти три личности?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "18. Кто эти три личности?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Three identical soft circles of light, gently overlapping, glowing against a warm sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 2. Сотворение

### Вопрос 19. Кто сотворил мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "19. Кто сотворил мир?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A panorama of a freshly created world: mountains, sea, forest, all beneath a clear, radiant sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 20. Из чего Бог сотворил мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "20. Из чего Бог сотворил мир?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: On one side, soft dark empty space; on the other, a bright blooming landscape — light emerging gently from darkness. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 21. Как Бог сотворил мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "21. Как Бог сотворил мир?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An open scroll resting in front of a newly created landscape of hills, sea, and sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 22. Сколько времени ушло на сотворение мира?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "22. Сколько времени ушло на сотворение мира?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Sun and crescent moon appearing together softly in the sky above a fresh green landscape. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 23. Что Бог делал в седьмой день?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "23. Что Бог делал в седьмой день?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A still, peaceful landscape bathed in soft evening light — a quiet day of rest. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 24. Кто был первым сотворенным мужчиной?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "24. Кто был первым сотворенным мужчиной?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A man in a simple modest tunic stands with his back to the viewer amid a lush garden. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 25. Кто был первой сотворенной женщиной?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "25. Кто был первой сотворенной женщиной?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A woman in a modest, long flowing dress stands at a gentle distance among garden greenery. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 26. Из чего Бог сотворил Адама?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "26. Из чего Бог сотворил Адама?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A gentle handful of light-colored earth resting before a blooming garden — a quiet symbol of creation. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 27. Из чего Бог сотворил Еву?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "27. Из чего Бог сотворил Еву?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A man sleeps peacefully beneath a tree in a garden; a woman's modest silhouette stands nearby. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 28. Что еще кроме тела Бог дал Адаму и Еве?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "28. Что еще кроме тела Бог дал Адаму и Еве?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Adam and Eve, modestly dressed in simple tunics, stand together in a garden, a soft warm glow near their hearts. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 29. А у тебя есть душа?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "29. А у тебя есть душа?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A boy stands with his hand gently over his heart, where a small warm light glows softly. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 30. Откуда ты знаешь, что у тебя есть душа?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "30. Откуда ты знаешь, что у тебя есть душа?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child reads a Bible beneath a tree, discovering the quiet truth of an unseen soul. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 3. Как человек согрешил?

### Вопрос 31. Были ли Адам и Ева хорошими, когда Бог сотворил их?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "31. Были ли Адам и Ева хорошими, когда Бог сотворил их?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Adam and Eve, modestly dressed, stand together in a bright, blooming garden, at peace. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 32. Что такое грех?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "32. Что такое грех?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A fork in a path: one bright straight road and one dim path curving away into shadow. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 33. Что такое непослушание Божьему закону?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "33. Что такое непослушание Божьему закону?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A signpost with a crossed-out symbol beside the road, while a small figure wanders toward it. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 34. Что такое несоблюдение Божьего закона?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "34. Что такое несоблюдение Божьего закона?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child stands with their back to an open book of rules they have not followed, head lowered. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 35. Навсегда ли Адам и Ева остались хорошими?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "35. Навсегда ли Адам и Ева остались хорошими?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A garden with a distant tree and fruit; the modestly dressed figures of Adam and Eve stand near the entrance looking sorrowful. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 36. Как согрешили Адам и Ева?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "36. Как согрешили Адам и Ева?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A tree bearing fruit in a garden, a serpent's silhouette on a distant branch, human figures standing far away. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 4. Что произошло в результате греха?

### Вопрос 37. Что произошло с Адамом и Евой, когда они согрешили?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "37. Что произошло с Адамом и Евой, когда они согрешили?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Distant garden gates closing; a path leads two small figures away from them. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 38. Влияет ли грех Адама на нас?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "38. Влияет ли грех Адама на нас?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A line of identical small child silhouettes following one another along a long road. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 39. Как называется это греховное состояние?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "39. Как называется это греховное состояние?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A small dark cloud quietly trailing behind one lone child figure walking a sunlit path. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 40. В каких еще грехах, кроме первородного, мы виновны?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "40. В каких еще грехах, кроме первородного, мы виновны?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A fork of several small paths; a child stands uncertain, unsure which way to turn. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 41. Чего мы заслуживаем за свои грехи?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "41. Чего мы заслуживаем за свои грехи?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Heavy closed gates against a dark sky, with soft light glowing faintly on the far side. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 42. Может ли кто-нибудь попасть на небеса в таком греховном состоянии?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "42. Может ли кто-нибудь попасть на небеса в таком греховном состоянии?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A tall wall with closed gates before a bright garden; a child stands outside, off to the side. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 5. Спасение

### Вопрос 43. Что сделал Бог, чтобы спасти Свой народ от гнева и наказания?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "43. Что сделал Бог, чтобы спасти Свой народ от гнева и наказания?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A cross on a hilltop bathed in soft light, with distant open garden gates glowing beyond. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 44. Кто такой Божий Сын?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "44. Кто такой Божий Сын?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An open Bible with a single bright star shining above it — a symbol of the promised Savior. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 45. Как Божий Сын пришел в наш мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "45. Как Божий Сын пришел в наш мир?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A simple manger filled with straw inside a humble stable, a bright star glowing softly in the sky above the roof. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 46. Кто стал Его матерью?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "46. Кто стал Его матерью?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A modestly dressed woman in a headscarf stands beside the manger, seen gently from behind. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 47. Был ли у Иисуса Христа земной отец?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "47. Был ли у Иисуса Христа земной отец?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A bright star shines its soft light down over an empty stable, no one else present beside the manger. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 48. Почему Он родился именно таким образом?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "48. Почему Он родился именно таким образом?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A manger glowing under starlight, with a single spotless white cloth resting inside. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 49. Согрешил ли Иисус хотя бы один раз?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "49. Согрешил ли Иисус хотя бы один раз?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A plain white garment neatly folded on a stone, without a single mark — a symbol of sinlessness. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 50. Почему Божьего Сына зовут Иисус?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "50. Почему Божьего Сына зовут Иисус?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A scroll tied with a ribbon resting on a lectern in warm light — the promised good news. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 51. Как Иисус спас Свой народ от грехов?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "51. Как Иисус спас Свой народ от грехов?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A cross standing on a hillside at Golgotha, silhouetted against a warm sunset sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 52. За кого пострадал и умер Иисус Христос?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "52. За кого пострадал и умер Иисус Христос?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A cross on a hilltop, with a scattered crowd of modestly dressed silhouettes gathered quietly below. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 53. Кто будет спасен?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "53. Кто будет спасен?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child kneels on a path that leads toward a distant, glowing cross. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 54. Как ты можешь покаяться в грехах?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "54. Как ты можешь покаяться в грехах?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child kneels with head bowed and hands folded beside a stone, in quiet repentance. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 55. Можешь ли ты сам решить покаяться и поверить в Иисуса Христа?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "55. Можешь ли ты сам решить покаяться и поверить в Иисуса Христа?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child stands with open palms raised toward a bright sky, waiting hopefully for help. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 56. Как ты можешь получить помощь Святого Духа?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "56. Как ты можешь получить помощь Святого Духа?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child kneels in prayer beneath a tree, a gentle breeze softly stirring the grass around them. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 57. Как спасались люди, жившие до того, как Христос умер за наши грехи?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "57. Как спасались люди, жившие до того, как Христос умер за наши грехи?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A biblical figure in a simple tunic gazes toward a distant, bright star in the evening sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 6. Иисус Христос – Пророк, Священник и Царь

### Вопрос 58. Как Иисус Христос исполнил ветхозаветные пророчества о Нем?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "58. Как Иисус Христос исполнил ветхозаветные пророчества о Нем?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An open Bible, a cross, and a crown resting together on a stone pedestal — three symbols of one calling. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 59. В каком смысле Христос является нашим Пророком?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "59. В каком смысле Христос является нашим Пророком?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An open Bible glowing softly, resting on a stone among quiet hills. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 60. В каком смысле Христос является нашим Священником?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "60. В каком смысле Христос является нашим Священником?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A cross on a hillside at Golgotha, glowing warmly in the light of sunset. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 61. В каком смысле Христос является нашим Царем?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "61. В каком смысле Христос является нашим Царем?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A golden crown resting on a velvet cushion, set against a calm hillside landscape. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 7. Десять заповедей

### Вопрос 62. Сколько заповедей дал Бог на горе Синай?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "62. Сколько заповедей дал Бог на горе Синай?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Two stone tablets resting atop Mount Sinai beneath a clear sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 63. О чем говорят нам первые четыре заповеди?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "63. О чем говорят нам первые четыре заповеди?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Stone tablets on one side, a soft glow of light above — commandments about loving God. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 64. О чем говорят нам заповеди с пятой по десятую?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "64. О чем говорят нам заповеди с пятой по десятую?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: People of different ages standing together on a meadow, holding hands — love for one's neighbor. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 65. О чем в целом говорят все десять заповедей?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "65. О чем в целом говорят все десять заповедей?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child reaches out a hand to help an elderly person along a hillside path. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 66. Кто наш ближний?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "66. Кто наш ближний?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: One traveler helps another rise from the road; both are dressed modestly. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 67. О чем говорит первая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "67. О чем говорит первая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A solitary mountain beneath an empty sky with a single beam of light — one God alone. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 68. Что велит нам делать первая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "68. Что велит нам делать первая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child prays alone on a hillside, face turned toward light streaming from the sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 69. О чем говорит вторая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "69. О чем говорит вторая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A broken stone statue lies off to one side; a child looks away, toward the light instead. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 70. Что велит нам делать вторая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "70. Что велит нам делать вторая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child holds an open Bible while standing in a meadow; a discarded stone statue lies far in the distance. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 71. О чем говорит третья заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "71. О чем говорит третья заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A quiet courtyard for prayer; a child stands calmly with head bowed. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 72. Что велит нам делать третья заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "72. Что велит нам делать третья заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child sits quietly with eyes closed and hands folded, surrounded by stillness. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 73. О чем говорит четвертая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "73. О чем говорит четвертая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Stone tablets resting before Mount Sinai on a calm, clear day. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 74. Что велит нам делать четвертая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "74. Что велит нам делать четвертая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A quiet village at rest, no work being done; families relax together on the grass by their homes. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 75. Какой день недели является Божьей субботой для христиан?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "75. Какой день недели является Божьей субботой для христиан?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A sun rising softly over gentle hills — a symbol of the new, first day of the week. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 76. Что мы должны делать в Божью субботу?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "76. Что мы должны делать в Божью субботу?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A family walks together hand in hand along a path toward a gathering place. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 77. О чем говорит пятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "77. О чем говорит пятая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child holds the hands of a man and woman while walking along a path. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 78. Что велит нам делать пятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "78. Что велит нам делать пятая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child helps in a garden alongside modestly dressed adults. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 79. О чем говорит шестая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "79. О чем говорит шестая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Two children playing peacefully together in the shade of a tree on a meadow. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 80. Что велит нам делать шестая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "80. Что велит нам делать шестая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Two children playing happily together on a sunny meadow. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 81. О чем говорит седьмая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "81. О чем говорит седьмая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A modestly dressed family walking together along a path toward home. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 82. Что велит нам делать седьмая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "82. Что велит нам делать седьмая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child walks tall and upright along a bright path, looking ahead. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 83. О чем говорит восьмая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "83. О чем говорит восьмая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child returns a found item to another child on a meadow. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 84. Что велит нам делать восьмая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "84. Что велит нам делать восьмая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Two children exchanging a gift with warm smiles on a meadow. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 85. О чем говорит девятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "85. О чем говорит девятая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Two children standing face to face, talking calmly with one another. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 86. Что велит нам делать девятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "86. Что велит нам делать девятая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child looks straight ahead openly, one hand resting on their chest — a picture of honesty. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 87. О чем говорит десятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "87. О чем говорит десятая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child looks contentedly at their own basket of fruit, not glancing at a neighbor's. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 88. Что велит нам делать десятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "88. Что велит нам делать десятая заповедь?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child sits on a doorstep with simple food and a flower in hand, smiling warmly. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 8. Соблюдение Божьих законов

### Вопрос 89. Можем ли мы полностью и правильно соблюсти все десять заповедей?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "89. Можем ли мы полностью и правильно соблюсти все десять заповедей?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Stone tablets with a visible crack, set against a peaceful landscape. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 90. Смог ли кто-нибудь полностью исполнить все десять заповедей?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "90. Смог ли кто-нибудь полностью исполнить все десять заповедей?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An open Bible and a crown resting together on a stone in soft light. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 91. Чего мы заслужили за нарушение Божьих заповедей?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "91. Чего мы заслужили за нарушение Божьих заповедей?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Heavy closed gates in the distance against a dark sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 9. Способ спасения

### Вопрос 92. Как мы можем спастись от Божьего гнева и наказания?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "92. Как мы можем спастись от Божьего гнева и наказания?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child kneels on a bright path leading toward a distant cross. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 93. Что такое вера?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "93. Что такое вера?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child reaches open palms toward light streaming down from the sky. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 94. Что такое покаяние?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "94. Что такое покаяние?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child kneels with head bowed beside a stone, in quiet repentance. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 10. Жизнь спасенного человека

### Вопрос 95. Как Бог помогает нам жить после того, как Он спас нас?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "95. Как Бог помогает нам жить после того, как Он спас нас?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child sits with a Bible among other children and adults, quietly praying together. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 96. Как мы должны читать Божье Слово?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "96. Как мы должны читать Божье Слово?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child reads an open Bible attentively at a table by a window. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 11. Крещение и вечеря Господня

### Вопрос 97. Какие есть церковные установления?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "97. Какие есть церковные установления?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A vessel of water and bread with a cup resting together on a simple table — two church ordinances. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 98. Что такое крещение?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "98. Что такое крещение?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A river or vessel of clear water gently flowing in soft light. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 99. Что такое Вечеря Господня?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "99. Что такое Вечеря Господня?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Bread and a cup resting on a simple table covered with a white cloth. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 100. Что означают хлеб и вино?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "100. Что означают хлеб и вино?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Bread and a cup shown up close on a table in warm light. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 101. Почему Иисус Христос повелел верующим в Него соблюдать это установление?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "101. Почему Иисус Христос повелел верующим в Него соблюдать это установление?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Bread and a cup on a table, modestly dressed people seated quietly around it. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 12. Молитва

### Вопрос 102. Что такое молитва?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "102. Что такое молитва?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child kneels beside a bed with hands folded, soft evening light around them. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 103. Во имя кого мы должны молиться?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "103. Во имя кого мы должны молиться?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child prays with an open Bible resting on the table before them. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 104. Что дал нам Бог, чтобы научить нас молиться?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "104. Что дал нам Бог, чтобы научить нас молиться?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An open Bible on a table, a soft beam of light falling across its pages. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 105. О чем говорится в молитве «Отче наш»?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "105. О чем говорится в молитве «Отче наш»?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A child prays on their knees in a field at sunset, hands folded quietly. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 13. Где Иисус Христос находится сейчас?

### Вопрос 106. Остался ли Иисус Христос после Своей смерти в могиле?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "106. Остался ли Иисус Христос после Своей смерти в могиле?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An empty tomb with its stone rolled away, soft light glowing gently from within. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 107. Где Христос находится сейчас?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "107. Где Христос находится сейчас?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: An empty throne set on a raised platform among bright clouds, a crown resting on the seat. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 108. Придет ли Христос снова в наш мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "108. Придет ли Христос снова в наш мир?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A flock of sheep and a separate herd of goats standing apart on a meadow, a shepherd's staff resting nearby. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 14. Смерть

### Вопрос 109. Что происходит с человеком, когда он умирает?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "109. Что происходит с человеком, когда он умирает?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A quiet room filled with soft light from a window at sunset — a picture of peaceful rest. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 110. Будут ли когда-нибудь воскрешены тела умерших?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "110. Будут ли когда-нибудь воскрешены тела умерших?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Dawn breaking over gentle hills, a fresh green shoot sprouting from the earth. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 15. Ад

### Вопрос 111. Куда Бог отправляет неверующих грешников после их смерти?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "111. Куда Бог отправляет неверующих грешников после их смерти?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: Heavy dark closed gates in the distance beneath a dim sky, with a bright path glowing softly to one side. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 112. Что такое ад?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "112. Что такое ад?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A dark closed door with no light, contrasted with a bright landscape glowing in the distance. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

## Раздел 16. Рай

### Вопрос 113. Куда направляется после смерти послушный Богу человек?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "113. Куда направляется после смерти послушный Богу человек?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A bright, blooming garden with soft glowing light and open gates. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.

### Вопрос 114. Что такое рай?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "114. Что такое рай?". Centered exactly both horizontally and vertically, large bold Russian font.

Scene: A peaceful garden bathed in soft light, birds fluttering gently, trees in full blossom. Conservative Christian modesty: women/girls in below-knee dresses or skirts, long sleeves, closed neckline, no pants or shorts, hair long and neatly tied back or covered; men/boys in fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light, portrait 105:148.
