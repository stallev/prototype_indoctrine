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
} as const;
