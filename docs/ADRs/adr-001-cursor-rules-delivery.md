# ADR-001 — Доставка конвенций из `.cursor/rules` для Claude Code

**Дата:** 2026-08-20
**Статус:** ACCEPTED

Связанные документы:

- [`../coding-conventions.md`](../coding-conventions.md) — куда легли применимые правила
- [`../multi-agent-workflow.md`](../multi-agent-workflow.md) — где используется `.claude/agents/code-reviewer.md`
- [`../reference/ai_first_tmp/.cursor/rules/`](../reference/ai_first_tmp/.cursor/rules/) — происхождение (read-only архив, не изменяется)

---

## 1. Контекст

При планировании миграции на Next.js было решено взять коллекцию Cursor Rules из референсного monorepo-шаблона `docs/reference/ai_first_tmp/.cursor/rules/*.mdc` (33 файла, методология Pulse — fitness-marketplace на Prisma v7 + Auth.js + S3 + Sentry + monorepo `apps/web`/`apps/workers`) как источник конвенций реализации.

Позже выяснилось, что фактический исполнитель кода — **агенты Claude Code**, а не Cursor AI. Формат `.mdc` (frontmatter `description`/`globs`/`alwaysApply`) — специфичен для Cursor и не читается Claude Code автоматически. Кроме того, подавляющее большинство правил в референсе завязаны на инфраструктуру, которой в этом проекте нет и не планируется: Prisma/БД, авторизация, S3, monorepo-пакеты, отдельная UI-тема другого продукта ("warm forest").

Копирование `.mdc`-файлов «как есть» в этот репозиторий создало бы источник инструкций, который (а) не читается используемым исполнителем автоматически, (б) на ~70% состоит из нерелевантных правил, (в) продублировал бы уже существующие правила `CLAUDE.md` этого проекта в другом формате.

---

## 2. Решение

| Политика | Значение |
|---|---|
| **Копирование `.mdc` файлов в репозиторий** | Не выполняется — референс остаётся только в `docs/reference/ai_first_tmp/` как read-only архив происхождения |
| **Применимые конвенции** | Переносятся в переработанном виде в [`docs/coding-conventions.md`](../coding-conventions.md), в дом-стиле репозитория (русский, нумерованные разделы) |
| **Процессное правило ревью кода** | Не текст, а реальный артефакт — `.claude/agents/code-reviewer.md` (сабагент Claude Code) |
| **Процессное правило verify→review→commit** | Только последовательность verify→review переносится в [`multi-agent-workflow.md`](../multi-agent-workflow.md); автокоммит-часть отклонена (коммиты — только по явному запросу пользователя) |
| **Провенанс** | Референсный каталог цитируется как источник, но не рассматривается как загружаемое агентом правило |

---

## 3. Adopt (перенесено — с указанием, куда)

| Правило (`.mdc`) | Куда легло |
|---|---|
| `agent-code-review-subagent.mdc` | `.claude/agents/code-reviewer.md` — сабагент вместо документа |
| `agent-commit-pipeline.mdc` (частично: verify→review) | `multi-agent-workflow.md` §2–3, §5а (без автокоммита на уровне задачи; автокоммит есть только на уровне фазы, см. §9 этого ADR — исключение) |
| `ai-dry-deduplication.mdc` | `coding-conventions.md` §3 + [`conventions/components.md`](../conventions/components.md) §6 (перенесено содержание, не только название) |
| `app-router-streaming-loading.mdc` (базовая часть) | `coding-conventions.md` §2 + [`conventions/data-routing-security.md`](../conventions/data-routing-security.md) §3 |
| `data-server-actions-and-api.mdc` (сужено до одного роута) | `coding-conventions.md` §2, §5 + [`conventions/data-routing-security.md`](../conventions/data-routing-security.md) §1, `image-generator-tool-spec.md` |
| `javascript-fundamentals.mdc` | `coding-conventions.md` §3 + [`conventions/data-routing-security.md`](../conventions/data-routing-security.md) §4 (асинхронные паттерны) |
| `nextjs-vercel-app-router.mdc` (базовая часть) | `coding-conventions.md` §2 |
| `product-docs-alignment.mdc` | `coding-conventions.md` §1 + [`conventions/data-routing-security.md`](../conventions/data-routing-security.md) §8 (принцип синхронизации доков и кода + порядок приоритета документов) |
| `react-logic-presentation.mdc` | `coding-conventions.md` §3 + [`conventions/components.md`](../conventions/components.md) §4 |
| `react-naming-conventions.mdc` | `coding-conventions.md` §3 + [`conventions/components.md`](../conventions/components.md) §2 |
| `react-one-component-per-file.mdc` | `coding-conventions.md` §3 + [`conventions/components.md`](../conventions/components.md) §1 |
| `react-state-management.mdc` | `coding-conventions.md` §3 + [`conventions/hooks-and-state.md`](../conventions/hooks-and-state.md) §1 |
| `react-ui-components.mdc` | `coding-conventions.md` §4 + [`conventions/components.md`](../conventions/components.md) §3, §5 + [`conventions/hooks-and-state.md`](../conventions/hooks-and-state.md) §2 |
| `security-xss-csrf.mdc` (сужено) | `coding-conventions.md` §5 + [`conventions/data-routing-security.md`](../conventions/data-routing-security.md) §5–6 |
| `ui-animation-performance.mdc` | `coding-conventions.md` §4 + [`conventions/accessibility-and-motion.md`](../conventions/accessibility-and-motion.md) §6 |
| `ui-icons-lucide.mdc` | `coding-conventions.md` §4 + [`conventions/copy-icons-fidelity.md`](../conventions/copy-icons-fidelity.md) §2 |
| `ui-messages-and-copy.mdc` (без i18n/локализации) | `coding-conventions.md` §4 + [`conventions/copy-icons-fidelity.md`](../conventions/copy-icons-fidelity.md) §1 |
| `ui-mobile-first.mdc` | `coding-conventions.md` §4 (уже была конвенция прототипа в `static-prototype-spec.md` §4, подтверждена) |
| `ui-mutation-pending.mdc` (сужено до формы генератора) | `image-generator-tool-spec.md` |
| `ui-prototype-fidelity.mdc` | `coding-conventions.md` §4 + [`conventions/copy-icons-fidelity.md`](../conventions/copy-icons-fidelity.md) §3 |
| `ui-semantics-a11y.mdc` | `coding-conventions.md` §4 + [`conventions/accessibility-and-motion.md`](../conventions/accessibility-and-motion.md) §1–5 |
| `ui-toast-mutations.mdc` (сужено до формы генератора) | `image-generator-tool-spec.md` |

## 4. Reject (не переносится — и почему)

| Правило (`.mdc`) | Причина отклонения |
|---|---|
| `admin-forms-layout.mdc` | В проекте нет админ-панели |
| `auth-security.mdc` | Нет авторизации/ролей пользователей |
| `domain-literals-and-codes.mdc` | Домен фиксирован (114 вопросов), уже типизирован в `utils/catechism.ts`/`content/*.ts`; пакет доменных кодов/`MutationResult<T>` не нужен |
| `ios-safari-mutation-transport.mdc` | Нет сложных оптимистичных мутаций, требующих специального транспорта |
| `patterns-tables-dnd.mdc` | Нет таблиц/drag-and-drop в интерфейсе |
| `policy-packages.mdc` | Нет monorepo и policy-пакетов (`@scope/policy-edge`/`policy-server`) |
| `project-context.template.mdc` | Роль "контекста проекта" уже выполняет `CLAUDE.md` этого репозитория — не дублируется отдельным файлом |
| `s3-file-asset-uploads.mdc` | Иллюстрации — файлы в репозитории; инструмент генерации изображений отдаёт файл клиенту на скачивание, ничего не загружает в облачное хранилище |
| `typescript-monorepo-types.mdc` | Нет монорепозитория; необходимый минимум — в `coding-conventions.md` §3 |
| `ui-optimistic-mutations.mdc` | Форма генератора изображений — единичное действие с обычным pending-состоянием, оптимистичный UI избыточен |
| `ui-warm-forest-shadcn.mdc` | Тема другого продукта (Pulse); авторитетная палитра этого проекта — `static-prototype-spec.md` §5.1, уже существует |

---

## 5. Последствия

### Positive

- Единый источник конвенций (`CLAUDE.md` + `coding-conventions.md`), реально читаемый Claude Code, без параллельного "мёртвого" набора `.mdc`-файлов, которые никто не исполняет.
- Меньше документации — только применимые 22 из 33 правил, без переноса чужой предметной области (Pulse).
- Процессные правила (ревью кода) стали исполняемым артефактом (сабагент), а не текстом, который агент может проигнорировать.

### Negative

- При обновлении референсного шаблона (`docs/reference/ai_first_tmp`) синхронизация не автоматическая — обновления придётся переносить вручную и повторно оценивать applicability.
- Часть контекста (нумерация правил, точные формулировки Pulse) теряется при пересказе; при разногласиях `coding-conventions.md` и `CLAUDE.md` этого репозитория — источник истины, референс — только происхождение.

---

## 6. Change log

| Дата | Изменение |
|---|---|
| 2026-08-20 | v1.0 — ACCEPTED; adopt/reject таблица по всем 33 файлам `.cursor/rules/*.mdc` |
| 2026-08-21 | v1.1 — v1.0 указывал только номер раздела `coding-conventions.md` без фактического переноса содержания правил (components/hooks/pages/a11y/security и т.п.). Добавлен каталог `docs/conventions/` (5 файлов) с реально перенесённым и адаптированным содержанием применимых `.mdc`; Adopt-таблица §3 обновлена ссылками на конкретные файлы/разделы. |
