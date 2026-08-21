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
    overlayTextHint:
      'Кириллица рисуется поверх картинки (Arial, оранжевый) — модель текст не генерирует, поэтому без опечаток.',
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
      'Ориентир по тарифу Google Paid (gemini-2.5-flash-image): ~$0.039 за картинку + входные токены промпта. Не фактический счёт.',
  },
} as const;
