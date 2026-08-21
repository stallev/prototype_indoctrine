// Короткие UI-строки интерфейса (не контент вопросов/ответов/стихов из
// content/*.ts) — собраны в одном модуле, чтобы не дублировать одну и ту
// же строку в нескольких компонентах. См. docs/conventions/copy-icons-fidelity.md §1.
export const messages = {
  nav: {
    prev: 'Предыдущий',
    next: 'Следующий',
    toTopic: 'К разделу',
    drawerTitle: 'Содержание',
    tableOfContents: 'Оглавление',
  },
  error: {
    title: 'Что-то пошло не так',
    retry: 'Повторить',
  },
  imageGenerator: {
    heading: 'Генератор изображений',
    accessKeyLabel: 'Ключ доступа',
    unlock: 'Войти',
    accessKeyError: 'Неверный ключ доступа.',
    promptLabel: 'Текстовый запрос',
    promptPlaceholder: 'Опишите изображение, которое нужно сгенерировать',
    questionPromptLabel: 'Промпт по вопросу катехизиса',
    questionPromptPlaceholder: 'Выберите вопрос — сцена подставится ниже, текст наложится после генерации',
    overlayQuestionTextLabel: 'Добавить текст вопроса на фото',
    overlayTextColorLabel: 'Цвет текста',
    overlayTextHint:
      'Кириллица рисуется поверх картинки (Arial) — модель текст не генерирует, поэтому без опечаток.',
    aspectRatioLabel: 'Соотношение сторон',
    submit: 'Сгенерировать',
    pending: 'Генерация…',
    download: 'Скачать',
    downloadFileName: 'generated-image.png',
    previewAlt: 'Сгенерированное изображение',
    emptyPromptError: 'Введите текст запроса.',
    genericError: 'Не удалось сгенерировать изображение. Попробуйте ещё раз.',
    estimatedCost: (usd: string) => `Примерная себестоимость этой генерации: ~$${usd} USD`,
    estimatedCostNote:
      'Ориентир по тарифу xAI Grok Imagine: $0.02 за картинку (flat). Не фактический счёт.',
  },
} as const;
