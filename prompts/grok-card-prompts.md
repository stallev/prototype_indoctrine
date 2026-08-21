# Промпты для Grok Imagine — печатные карточки катехизиса (A6)

Для ручной генерации в Grok Imagine, по одному промпту за раз. Каждый промпт — только
лицевая сторона карточки (иллюстрация); оборот (ответ + стих на цветной подложке, без
иллюстрации) в этот файл не входит — вёрстка обеих сторон делается отдельным, ещё не
спроектированным шагом (наложение текста и печатной подложки поверх сгенерированного
изображения, не самим Grok).

**Печатные параметры (справочно, не гарантия точного вывода Grok):**
A6, **альбомная** ориентация, 148×105 мм (соотношение сторон **148:105**); вылет под обрез
~3 мм (итого ~154×111 мм); ориентир разрешения под печать 300dpi — ~1748×1240 px по обрезу
/ ~1819×1311 px с вылетом. Точную подгонку размера/обреза делает следующий, отдельный шаг
вёрстки — не сама генерация в Grok.

**Жёсткие правила текста (дублируются в каждом промпте):**
1. Гарнитура единственного текста на карточке — **Arial**.
2. Цвет текста — **оранжевый** (`#FF8C00`).
3. Кириллица — **буквально** как в кавычках после `Text —`, без опечаток и лишних слов.

Ориентация и соотношение сторон **не** задаются в тексте промпта — их выбирают
в UI генератора (`aspectRatio` → `generateImage`). Печатный ориентир A6 альбом
148×105 мм остаётся справочным выше; фактический кадр API — из поддерживаемых
Gemini соотношений (для A6 в UI дефолт `148:105` маппится на ближайшее `4:3`).

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

**Люди и одежда:** в каждом `Scene:` явно указано `People: none` или `People: exactly N` с полом и возрастом.
Одежда/причёска (conservative Christian modesty) — **только** если в кадре есть люди; для сцен без людей эти требования не добавляются.

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

Text — the ONLY text anywhere in this image, nothing else added anywhere: "1. Кто тебя сотворил?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Two children stand in a blooming meadow under a warm sky, soft golden sunbeams breaking through light clouds, a tender and peaceful mood. People: exactly 2 — one boy age ~7 and one girl age ~7, standing together in the meadow. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 2. Для чего Бог сотворил тебя?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "2. Для чего Бог сотворил тебя?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child stands with arms raised joyfully toward a soft sunrise sky, surrounded by blooming wildflowers and a warm glow of golden light. People: exactly 1 — one child age ~7 (boy or girl), standing with arms raised. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 3. Что еще сотворил Бог?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "3. Что еще сотворил Бог?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A rich tapestry of creation: rolling mountains, a green forest, a calm sea, birds soaring and animals grazing beneath a vast warm sky. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 4. Для чего Бог сотворил все?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "4. Для чего Бог сотворил все?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A sweeping panorama of creation — rolling hills, a lush forest, birds in flight, all bathed in warm golden light. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 5. Где Бог учит нас прославлять Его и наслаждаться Им?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "5. Где Бог учит нас прославлять Его и наслаждаться Им?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A boy sits beneath a large shade tree on a gentle hillside, reading an open Bible, soft afternoon light filtering through the leaves. People: exactly 1 — one boy age ~7–8, sitting under a tree and reading. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 6. Кто написал Библию?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "6. Кто написал Библию?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An open Bible rests on a smooth stone, gentle light falling softly from above onto its pages. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 7. Кто есть Бог?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "7. Кто есть Бог?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A luminous sky filled with soft golden rays breaking through gentle clouds — no figures, just warm radiant light. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 8. Кто такой дух?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "8. Кто такой дух?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A soft, glowing cloud-like radiance drifting gently in the sky, formless and faceless, warm and soft-edged. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 9. Где находится Бог?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "9. Где находится Бог?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child stands atop a hill gazing out at endless sky, sea, and land stretching to the horizon, warm light all around. People: exactly 1 — one child age ~7–8, standing on a hill. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 10. Было ли у Бога начало?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "10. Было ли у Бога начало?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A quiet range of hills beneath a star-filled dawn sky, calm and timeless, evoking eternity without beginning. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 11. Будет ли у Бога конец?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "11. Будет ли у Бога конец?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: The same peaceful landscape at dusk, soft starlight glowing evenly across the hills — eternity without end. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 12. Изменяется ли Бог?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "12. Изменяется ли Бог?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A smooth rock on a seashore, gentle waves lapping softly against it, steady and unchanging. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 13. Знает ли Бог все?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "13. Знает ли Бог все?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An open book lying beneath a single soft beam of light, symbolizing all-knowing wisdom. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 14. Все ли Бог может?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "14. Все ли Бог может?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Majestic mountains and a calm sea beneath a vast, clear sky, conveying quiet grandeur and power. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 15. Можешь ли ты увидеть Бога?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "15. Можешь ли ты увидеть Бога?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A boy stands with eyes closed, hands folded in prayer, face turned gently upward toward the sky. People: exactly 1 — one boy age ~7–8, standing in prayer with eyes closed. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 16. Сколько есть Богов?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "16. Сколько есть Богов?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A single bright beam of light breaking through soft clouds above one lone tree in an open field. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 17. Сколько личностей существует в Боге?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "17. Сколько личностей существует в Боге?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Three identical soft beams of light converging gently at one point in the sky. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 18. Кто эти три личности?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "18. Кто эти три личности?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Three identical soft circles of light, gently overlapping, glowing against a warm sky. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 2. Сотворение

### Вопрос 19. Кто сотворил мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "19. Кто сотворил мир?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A panorama of a freshly created world: mountains, sea, forest, all beneath a clear, radiant sky. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 20. Из чего Бог сотворил мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "20. Из чего Бог сотворил мир?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: On one side, soft dark empty space; on the other, a bright blooming landscape — light emerging gently from darkness. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 21. Как Бог сотворил мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "21. Как Бог сотворил мир?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An open scroll resting in front of a newly created landscape of hills, sea, and sky. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 22. Сколько времени ушло на сотворение мира?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "22. Сколько времени ушло на сотворение мира?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Sun and crescent moon appearing together softly in the sky above a fresh green landscape. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 23. Что Бог делал в седьмой день?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "23. Что Бог делал в седьмой день?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A still, peaceful landscape bathed in soft evening light — a quiet day of rest. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 24. Кто был первым сотворенным мужчиной?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "24. Кто был первым сотворенным мужчиной?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A man in a simple modest tunic stands with his back to the viewer amid a lush garden. People: exactly 1 — one adult man (Adam), back to viewer, adult age ~30. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 25. Кто был первой сотворенной женщиной?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "25. Кто был первой сотворенной женщиной?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A woman in a modest, long flowing dress stands at a gentle distance among garden greenery. People: exactly 1 — one adult woman (Eve), adult age ~30, at a gentle distance. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 26. Из чего Бог сотворил Адама?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "26. Из чего Бог сотворил Адама?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A gentle handful of light-colored earth resting before a blooming garden — a quiet symbol of creation. People: none — no humans, no faces, no human figures in the frame (hands/earth only as objects, no person visible). Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 27. Из чего Бог сотворил Еву?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "27. Из чего Бог сотворил Еву?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A man sleeps peacefully beneath a tree in a garden; a woman's modest silhouette stands nearby. People: exactly 2 — one adult man sleeping (Adam, ~30) and one adult woman silhouette nearby (Eve, ~30). Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 28. Что еще кроме тела Бог дал Адаму и Еве?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "28. Что еще кроме тела Бог дал Адаму и Еве?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Adam and Eve, modestly dressed in simple tunics, stand together in a garden, a soft warm glow near their hearts. People: exactly 2 — one adult man (Adam, ~30) and one adult woman (Eve, ~30), standing together. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 29. А у тебя есть душа?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "29. А у тебя есть душа?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A boy stands with his hand gently over his heart, where a small warm light glows softly. People: exactly 1 — one boy age ~7–8, hand over heart. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 30. Откуда ты знаешь, что у тебя есть душа?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "30. Откуда ты знаешь, что у тебя есть душа?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child reads a Bible beneath a tree, discovering the quiet truth of an unseen soul. People: exactly 1 — one child age ~7–8, reading a Bible under a tree. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 3. Как человек согрешил?

### Вопрос 31. Были ли Адам и Ева хорошими, когда Бог сотворил их?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "31. Были ли Адам и Ева хорошими, когда Бог сотворил их?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Adam and Eve, modestly dressed, stand together in a bright, blooming garden, at peace. People: exactly 2 — one adult man (Adam, ~30) and one adult woman (Eve, ~30), standing together. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 32. Что такое грех?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "32. Что такое грех?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A fork in a path: one bright straight road and one dim path curving away into shadow. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 33. Что такое непослушание Божьему закону?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "33. Что такое непослушание Божьему закону?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A signpost with a crossed-out symbol beside the road, while a small figure wanders toward it. People: exactly 1 — one small distant human figure (child age ~7–8), wandering toward the signpost. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 34. Что такое несоблюдение Божьего закона?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "34. Что такое несоблюдение Божьего закона?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child stands with their back to an open book of rules they have not followed, head lowered. People: exactly 1 — one child age ~7–8, standing with back to an open book, head lowered. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 35. Навсегда ли Адам и Ева остались хорошими?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "35. Навсегда ли Адам и Ева остались хорошими?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A garden with a distant tree and fruit; the modestly dressed figures of Adam and Eve stand near the entrance looking sorrowful. People: exactly 2 — one adult man (Adam, ~30) and one adult woman (Eve, ~30), near the garden entrance. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 36. Как согрешили Адам и Ева?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "36. Как согрешили Адам и Ева?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A tree bearing fruit in a garden, a serpent's silhouette on a distant branch, human figures standing far away. People: exactly 2 — two distant adult human figures (Adam and Eve, ~30), far from the tree. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 4. Что произошло в результате греха?

### Вопрос 37. Что произошло с Адамом и Евой, когда они согрешили?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "37. Что произошло с Адамом и Евой, когда они согрешили?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Distant garden gates closing; a path leads two small figures away from them. People: exactly 2 — two small distant figures (Adam and Eve as adults ~30), walking away from closing gates. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 38. Влияет ли грех Адама на нас?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "38. Влияет ли грех Адама на нас?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A line of identical small child silhouettes following one another along a long road. People: exactly 5 — five identical small child silhouettes (ages ~6–8), walking in a line; gender not distinct at distance. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 39. Как называется это греховное состояние?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "39. Как называется это греховное состояние?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A small dark cloud quietly trailing behind one lone child figure walking a sunlit path. People: exactly 1 — one child age ~7–8, walking a sunlit path. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 40. В каких еще грехах, кроме первородного, мы виновны?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "40. В каких еще грехах, кроме первородного, мы виновны?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A fork of several small paths; a child stands uncertain, unsure which way to turn. People: exactly 1 — one child age ~7–8, standing at a fork of paths. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 41. Чего мы заслуживаем за свои грехи?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "41. Чего мы заслуживаем за свои грехи?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Heavy closed gates against a dark sky, with soft light glowing faintly on the far side. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 42. Может ли кто-нибудь попасть на небеса в таком греховном состоянии?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "42. Может ли кто-нибудь попасть на небеса в таком греховном состоянии?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A tall wall with closed gates before a bright garden; a child stands outside, off to the side. People: exactly 1 — one child age ~7–8, standing outside closed gates, off to the side. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 5. Спасение

### Вопрос 43. Что сделал Бог, чтобы спасти Свой народ от гнева и наказания?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "43. Что сделал Бог, чтобы спасти Свой народ от гнева и наказания?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A cross on a hilltop bathed in soft light, with distant open garden gates glowing beyond. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 44. Кто такой Божий Сын?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "44. Кто такой Божий Сын?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An open Bible with a single bright star shining above it — a symbol of the promised Savior. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 45. Как Божий Сын пришел в наш мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "45. Как Божий Сын пришел в наш мир?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A simple manger filled with straw inside a humble stable, a bright star glowing softly in the sky above the roof. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 46. Кто стал Его матерью?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "46. Кто стал Его матерью?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A modestly dressed woman in a headscarf stands beside the manger, seen gently from behind. People: exactly 1 — one adult woman (Mary, ~20–25), headscarf, seen gently from behind beside the manger. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 47. Был ли у Иисуса Христа земной отец?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "47. Был ли у Иисуса Христа земной отец?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A bright star shines its soft light down over an empty stable, no one else present beside the manger. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 48. Почему Он родился именно таким образом?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "48. Почему Он родился именно таким образом?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A manger glowing under starlight, with a single spotless white cloth resting inside. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 49. Согрешил ли Иисус хотя бы один раз?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "49. Согрешил ли Иисус хотя бы один раз?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A plain white garment neatly folded on a stone, without a single mark — a symbol of sinlessness. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 50. Почему Божьего Сына зовут Иисус?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "50. Почему Божьего Сына зовут Иисус?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A scroll tied with a ribbon resting on a lectern in warm light — the promised good news. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 51. Как Иисус спас Свой народ от грехов?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "51. Как Иисус спас Свой народ от грехов?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A cross standing on a hillside at Golgotha, silhouetted against a warm sunset sky. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 52. За кого пострадал и умер Иисус Христос?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "52. За кого пострадал и умер Иисус Христос?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A cross on a hilltop, with a scattered crowd of modestly dressed silhouettes gathered quietly below. People: exactly 6 — a small scattered crowd of about six modest adult silhouettes (mixed men and women, adult ages), quiet below the cross; faces not detailed. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 53. Кто будет спасен?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "53. Кто будет спасен?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child kneels on a path that leads toward a distant, glowing cross. People: exactly 1 — one child age ~7–8, kneeling on a path. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 54. Как ты можешь покаяться в грехах?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "54. Как ты можешь покаяться в грехах?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child kneels with head bowed and hands folded beside a stone, in quiet repentance. People: exactly 1 — one child age ~7–8, kneeling with head bowed. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 55. Можешь ли ты сам решить покаяться и поверить в Иисуса Христа?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "55. Можешь ли ты сам решить покаяться и поверить в Иисуса Христа?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child stands with open palms raised toward a bright sky, waiting hopefully for help. People: exactly 1 — one child age ~7–8, standing with open palms raised. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 56. Как ты можешь получить помощь Святого Духа?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "56. Как ты можешь получить помощь Святого Духа?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child kneels in prayer beneath a tree, a gentle breeze softly stirring the grass around them. People: exactly 1 — one child age ~7–8, kneeling in prayer beneath a tree. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 57. Как спасались люди, жившие до того, как Христос умер за наши грехи?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "57. Как спасались люди, жившие до того, как Христос умер за наши грехи?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A biblical figure in a simple tunic gazes toward a distant, bright star in the evening sky. People: exactly 1 — one adult biblical man in a simple tunic (age ~30–40), gazing toward a star. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 6. Иисус Христос – Пророк, Священник и Царь

### Вопрос 58. Как Иисус Христос исполнил ветхозаветные пророчества о Нем?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "58. Как Иисус Христос исполнил ветхозаветные пророчества о Нем?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An open Bible, a cross, and a crown resting together on a stone pedestal — three symbols of one calling. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 59. В каком смысле Христос является нашим Пророком?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "59. В каком смысле Христос является нашим Пророком?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An open Bible glowing softly, resting on a stone among quiet hills. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 60. В каком смысле Христос является нашим Священником?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "60. В каком смысле Христос является нашим Священником?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A cross on a hillside at Golgotha, glowing warmly in the light of sunset. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 61. В каком смысле Христос является нашим Царем?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "61. В каком смысле Христос является нашим Царем?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A golden crown resting on a velvet cushion, set against a calm hillside landscape. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 7. Десять заповедей

### Вопрос 62. Сколько заповедей дал Бог на горе Синай?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "62. Сколько заповедей дал Бог на горе Синай?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Two stone tablets resting atop Mount Sinai beneath a clear sky. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 63. О чем говорят нам первые четыре заповеди?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "63. О чем говорят нам первые четыре заповеди?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Stone tablets on one side, a soft glow of light above — commandments about loving God. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 64. О чем говорят нам заповеди с пятой по десятую?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "64. О чем говорят нам заповеди с пятой по десятую?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: People of different ages standing together on a meadow, holding hands — love for one's neighbor. People: exactly 4 — two adults (one man ~35, one woman ~35) and two children (boy ~7, girl ~7), holding hands on a meadow. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 65. О чем в целом говорят все десять заповедей?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "65. О чем в целом говорят все десять заповедей?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child reaches out a hand to help an elderly person along a hillside path. People: exactly 2 — one child age ~7–8 helping one elderly person (man or woman, age ~70) along a path. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 66. Кто наш ближний?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "66. Кто наш ближний?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: One traveler helps another rise from the road; both are dressed modestly. People: exactly 2 — two adult travelers (two men ~30–40, or one man and one woman), one helping the other rise. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 67. О чем говорит первая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "67. О чем говорит первая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A solitary mountain beneath an empty sky with a single beam of light — one God alone. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 68. Что велит нам делать первая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "68. Что велит нам делать первая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child prays alone on a hillside, face turned toward light streaming from the sky. People: exactly 1 — one child age ~7–8, praying alone on a hillside. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 69. О чем говорит вторая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "69. О чем говорит вторая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A broken stone statue lies off to one side; a child looks away, toward the light instead. People: exactly 1 — one child age ~7–8, looking away from a broken statue toward the light. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 70. Что велит нам делать вторая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "70. Что велит нам делать вторая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child holds an open Bible while standing in a meadow; a discarded stone statue lies far in the distance. People: exactly 1 — one child age ~7–8, holding an open Bible in a meadow. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 71. О чем говорит третья заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "71. О чем говорит третья заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A quiet courtyard for prayer; a child stands calmly with head bowed. People: exactly 1 — one child age ~7–8, standing calmly with head bowed. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 72. Что велит нам делать третья заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "72. Что велит нам делать третья заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child sits quietly with eyes closed and hands folded, surrounded by stillness. People: exactly 1 — one child age ~7–8, sitting quietly with eyes closed. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 73. О чем говорит четвертая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "73. О чем говорит четвертая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Stone tablets resting before Mount Sinai on a calm, clear day. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 74. Что велит нам делать четвертая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "74. Что велит нам делать четвертая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A quiet village at rest, no work being done; families relax together on the grass by their homes. People: exactly 5 — one family: father ~35, mother ~35, three children ages ~5–10 (mixed boys/girls), relaxing on grass. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 75. Какой день недели является Божьей субботой для христиан?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "75. Какой день недели является Божьей субботой для христиан?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A sun rising softly over gentle hills — a symbol of the new, first day of the week. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 76. Что мы должны делать в Божью субботу?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "76. Что мы должны делать в Божью субботу?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A family walks together hand in hand along a path toward a gathering place. People: exactly 4 — one family walking: father ~35, mother ~35, boy ~7, girl ~7, hand in hand. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 77. О чем говорит пятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "77. О чем говорит пятая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child holds the hands of a man and woman while walking along a path. People: exactly 3 — one child age ~7–8 holding hands of one adult man (~35) and one adult woman (~35). Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 78. Что велит нам делать пятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "78. Что велит нам делать пятая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child helps in a garden alongside modestly dressed adults. People: exactly 3 — one child age ~7–8 and two modest adults (man ~35, woman ~35) helping in a garden. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 79. О чем говорит шестая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "79. О чем говорит шестая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Two children playing peacefully together in the shade of a tree on a meadow. People: exactly 2 — two children ages ~7–8 (one boy, one girl), playing peacefully under a tree. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 80. Что велит нам делать шестая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "80. Что велит нам делать шестая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Two children playing happily together on a sunny meadow. People: exactly 2 — two children ages ~7–8 (one boy, one girl), playing happily on a meadow. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 81. О чем говорит седьмая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "81. О чем говорит седьмая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A modestly dressed family walking together along a path toward home. People: exactly 4 — one family: father ~35, mother ~35, boy ~7, girl ~7, walking toward home. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 82. Что велит нам делать седьмая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "82. Что велит нам делать седьмая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child walks tall and upright along a bright path, looking ahead. People: exactly 1 — one child age ~7–8, walking upright on a bright path. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 83. О чем говорит восьмая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "83. О чем говорит восьмая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child returns a found item to another child on a meadow. People: exactly 2 — two children ages ~7–8 (one boy, one girl); one returns a found item to the other. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 84. Что велит нам делать восьмая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "84. Что велит нам делать восьмая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Two children exchanging a gift with warm smiles on a meadow. People: exactly 2 — two children ages ~7–8 (one boy, one girl), exchanging a gift. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 85. О чем говорит девятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "85. О чем говорит девятая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Two children standing face to face, talking calmly with one another. People: exactly 2 — two children ages ~7–8 (one boy, one girl), talking face to face. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 86. Что велит нам делать девятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "86. Что велит нам делать девятая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child looks straight ahead openly, one hand resting on their chest — a picture of honesty. People: exactly 1 — one child age ~7–8, looking ahead openly, hand on chest. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 87. О чем говорит десятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "87. О чем говорит десятая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child looks contentedly at their own basket of fruit, not glancing at a neighbor's. People: exactly 1 — one child age ~7–8, sitting contentedly with their own basket of fruit. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 88. Что велит нам делать десятая заповедь?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "88. Что велит нам делать десятая заповедь?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child sits on a doorstep with simple food and a flower in hand, smiling warmly. People: exactly 1 — one child age ~7–8, sitting on a doorstep with simple food. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 8. Соблюдение Божьих законов

### Вопрос 89. Можем ли мы полностью и правильно соблюсти все десять заповедей?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "89. Можем ли мы полностью и правильно соблюсти все десять заповедей?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Stone tablets with a visible crack, set against a peaceful landscape. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 90. Смог ли кто-нибудь полностью исполнить все десять заповедей?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "90. Смог ли кто-нибудь полностью исполнить все десять заповедей?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An open Bible and a crown resting together on a stone in soft light. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 91. Чего мы заслужили за нарушение Божьих заповедей?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "91. Чего мы заслужили за нарушение Божьих заповедей?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Heavy closed gates in the distance against a dark sky. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 9. Способ спасения

### Вопрос 92. Как мы можем спастись от Божьего гнева и наказания?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "92. Как мы можем спастись от Божьего гнева и наказания?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child kneels on a bright path leading toward a distant cross. People: exactly 1 — one child age ~7–8, kneeling on a bright path toward a distant cross. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 93. Что такое вера?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "93. Что такое вера?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child reaches open palms toward light streaming down from the sky. People: exactly 1 — one child age ~7–8, reaching open palms toward light. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 94. Что такое покаяние?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "94. Что такое покаяние?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child kneels with head bowed beside a stone, in quiet repentance. People: exactly 1 — one child age ~7–8, kneeling with head bowed beside a stone. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 10. Жизнь спасенного человека

### Вопрос 95. Как Бог помогает нам жить после того, как Он спас нас?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "95. Как Бог помогает нам жить после того, как Он спас нас?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child sits with a Bible among other children and adults, quietly praying together. People: exactly 5 — one child age ~7–8 with a Bible, plus two other children (~7) and two adults (~35), praying together. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 96. Как мы должны читать Божье Слово?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "96. Как мы должны читать Божье Слово?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child reads an open Bible attentively at a table by a window. People: exactly 1 — one child age ~7–8, reading an open Bible at a table by a window. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 11. Крещение и вечеря Господня

### Вопрос 97. Какие есть церковные установления?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "97. Какие есть церковные установления?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A vessel of water and bread with a cup resting together on a simple table — two church ordinances. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 98. Что такое крещение?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "98. Что такое крещение?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A river or vessel of clear water gently flowing in soft light. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 99. Что такое Вечеря Господня?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "99. Что такое Вечеря Господня?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Bread and a cup resting on a simple table covered with a white cloth. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 100. Что означают хлеб и вино?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "100. Что означают хлеб и вино?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Bread and a cup shown up close on a table in warm light. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 101. Почему Иисус Христос повелел верующим в Него соблюдать это установление?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "101. Почему Иисус Христос повелел верующим в Него соблюдать это установление?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Bread and a cup on a table, modestly dressed people seated quietly around it. People: exactly 4 — four modest adults (two men ~35–45, two women ~35–45) seated quietly around a table with bread and cup. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 12. Молитва

### Вопрос 102. Что такое молитва?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "102. Что такое молитва?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child kneels beside a bed with hands folded, soft evening light around them. People: exactly 1 — one child age ~7–8, kneeling beside a bed in prayer. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 103. Во имя кого мы должны молиться?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "103. Во имя кого мы должны молиться?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child prays with an open Bible resting on the table before them. People: exactly 1 — one child age ~7–8, praying with an open Bible on the table. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 104. Что дал нам Бог, чтобы научить нас молиться?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "104. Что дал нам Бог, чтобы научить нас молиться?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An open Bible on a table, a soft beam of light falling across its pages. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 105. О чем говорится в молитве «Отче наш»?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "105. О чем говорится в молитве «Отче наш»?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A child prays on their knees in a field at sunset, hands folded quietly. People: exactly 1 — one child age ~7–8, praying on knees in a field at sunset. Conservative Christian modesty clothing and hair as required for those people only: women/girls — below-knee dress or skirt, long sleeves, closed neckline, no pants/shorts, hair long and neatly tied back or covered; men/boys — fully covered clothing, no bare chest, short neat hairstyle. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 13. Где Иисус Христос находится сейчас?

### Вопрос 106. Остался ли Иисус Христос после Своей смерти в могиле?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "106. Остался ли Иисус Христос после Своей смерти в могиле?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An empty tomb with its stone rolled away, soft light glowing gently from within. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 107. Где Христос находится сейчас?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "107. Где Христос находится сейчас?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: An empty throne set on a raised platform among bright clouds, a crown resting on the seat. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 108. Придет ли Христос снова в наш мир?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "108. Придет ли Христос снова в наш мир?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A flock of sheep and a separate herd of goats standing apart on a meadow, a shepherd's staff resting nearby. People: none — no humans in the frame (sheep, goats, and a shepherd staff only; no shepherd figure). Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 14. Смерть

### Вопрос 109. Что происходит с человеком, когда он умирает?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "109. Что происходит с человеком, когда он умирает?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A quiet room filled with soft light from a window at sunset — a picture of peaceful rest. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 110. Будут ли когда-нибудь воскрешены тела умерших?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "110. Будут ли когда-нибудь воскрешены тела умерших?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Dawn breaking over gentle hills, a fresh green shoot sprouting from the earth. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 15. Ад

### Вопрос 111. Куда Бог отправляет неверующих грешников после их смерти?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "111. Куда Бог отправляет неверующих грешников после их смерти?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: Heavy dark closed gates in the distance beneath a dim sky, with a bright path glowing softly to one side. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 112. Что такое ад?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "112. Что такое ад?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A dark closed door with no light, contrasted with a bright landscape glowing in the distance. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

## Раздел 16. Рай

### Вопрос 113. Куда направляется после смерти послушный Богу человек?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "113. Куда направляется после смерти послушный Богу человек?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A bright, blooming garden with soft glowing light and open gates. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.

### Вопрос 114. Что такое рай?

Text — the ONLY text anywhere in this image, nothing else added anywhere: "114. Что такое рай?". Render this Russian Cyrillic quote EXACTLY as written, character-perfect, no typos, no extra words. Centered exactly both horizontally and vertically. Large bold Arial typeface. Text color: solid orange (#FF8C00). Hard rules: font family Arial only; text color orange only; no other text anywhere.

Scene: A peaceful garden bathed in soft light, birds fluttering gently, trees in full blossom. People: none — no humans, no faces, no human figures in the frame. Nothing frightening, no visible God/Jesus/Spirit figure. Warm soft painterly light.
