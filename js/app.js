// Роутинг, меню и рендер данных (docs/static-prototype-spec.md §6-9).
import {
  initCatechism,
  allTopics,
  getTopic,
  questionsForTopic,
  getQuestionWithVerses,
  illustrationPublicUrl,
} from './catechism-browser.js';

const MIN_QUESTION = 1;
const MAX_QUESTION = 114;
const PLACEHOLDER_SRC = 'images/_placeholder.svg';

const mainEl = document.getElementById('app-main');
const navTopicsEl = document.getElementById('nav-topics');
const drawerEl = document.getElementById('nav-drawer');
const overlayEl = document.getElementById('drawer-overlay');
const drawerToggleEl = document.getElementById('drawer-toggle');
const drawerCloseEl = document.getElementById('drawer-close');
const sidebarToggleEl = document.getElementById('sidebar-toggle');
const contentOffsetEl = document.getElementById('content-offset');
const appHeaderEl = document.getElementById('app-header');
const topicItemTpl = document.getElementById('tpl-topic-item');
const questionItemTpl = document.getElementById('tpl-question-item');
const verseBlockTpl = document.getElementById('tpl-verse-block');

const mqDesktop = window.matchMedia('(min-width: 768px)');

// --- Drawer (mobile menu + a11y) ---

let drawerOpen = false;
let focusBeforeOpen = null;

function isMobile() {
  return !mqDesktop.matches;
}

function trapFocus(event) {
  const focusable = Array.from(drawerEl.querySelectorAll('a[href], button:not([disabled])'));
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function onDrawerKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeDrawer();
  } else if (event.key === 'Tab') {
    trapFocus(event);
  }
}

function openDrawer() {
  if (drawerOpen) return;
  drawerOpen = true;
  focusBeforeOpen = document.activeElement;
  drawerEl.classList.add('drawer-open');
  drawerToggleEl.setAttribute('aria-expanded', 'true');
  if (isMobile()) {
    overlayEl.classList.remove('hidden');
    drawerEl.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onDrawerKeydown);
    drawerCloseEl.focus();
  }
}

function closeDrawer() {
  if (!drawerOpen) return;
  drawerOpen = false;
  drawerEl.classList.remove('drawer-open');
  drawerToggleEl.setAttribute('aria-expanded', 'false');
  overlayEl.classList.add('hidden');
  drawerEl.removeAttribute('aria-modal');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onDrawerKeydown);
  if (focusBeforeOpen instanceof HTMLElement) {
    focusBeforeOpen.focus();
  } else {
    drawerToggleEl.focus();
  }
}

drawerToggleEl.addEventListener('click', () => (drawerOpen ? closeDrawer() : openDrawer()));
drawerCloseEl.addEventListener('click', closeDrawer);
overlayEl.addEventListener('click', closeDrawer);

// --- Desktop sidebar collapse (separate from the mobile modal above: no
// overlay/focus-trap/scroll-lock, just a persistent layout toggle) ---

let sidebarCollapsed = false;

function setSidebarCollapsed(collapsed) {
  sidebarCollapsed = collapsed;
  drawerEl.classList.toggle('sidebar-collapsed', collapsed);
  contentOffsetEl.classList.toggle('sidebar-collapsed', collapsed);
  appHeaderEl.classList.toggle('sidebar-collapsed', collapsed);
  sidebarToggleEl.setAttribute('aria-expanded', String(!collapsed));
  sidebarToggleEl.setAttribute('aria-label', collapsed ? 'Показать содержание' : 'Скрыть содержание');
}

sidebarToggleEl.addEventListener('click', () => setSidebarCollapsed(!sidebarCollapsed));

mqDesktop.addEventListener('change', (event) => {
  if (event.matches) {
    closeDrawer();
  } else {
    setSidebarCollapsed(false);
  }
});

// --- Navigation drawer content (topics accordion) ---

function renderNavTopics() {
  navTopicsEl.replaceChildren();
  for (const topic of allTopics()) {
    const li = topicItemTpl.content.firstElementChild.cloneNode(true);
    const button = li.querySelector('.nav-topic-button');
    const questionsUl = li.querySelector('.nav-questions');
    li.querySelector('.nav-topic-name').textContent = topic.topic_name;

    const questionsId = `topic-${topic.topic_id}-questions`;
    questionsUl.id = questionsId;
    button.setAttribute('aria-controls', questionsId);
    button.dataset.route = `topic:${topic.topic_id}`;

    for (const q of questionsForTopic(topic.topic_id)) {
      const qLi = questionItemTpl.content.firstElementChild.cloneNode(true);
      const link = qLi.querySelector('.nav-question-link');
      link.href = `#/q/${q.question_number}`;
      link.dataset.route = `question:${q.question_number}`;
      qLi.querySelector('.nav-question-number').textContent = `${q.question_number}.`;
      qLi.querySelector('.nav-question-content').textContent = q.question_content;
      link.addEventListener('click', () => {
        if (isMobile()) closeDrawer();
      });
      questionsUl.appendChild(qLi);
    }

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      questionsUl.classList.toggle('hidden', expanded);
      window.location.hash = `#/topic/${topic.topic_id}`;
    });

    navTopicsEl.appendChild(li);
  }
}

function updateActiveNav(route) {
  for (const el of navTopicsEl.querySelectorAll('[aria-current]')) {
    el.removeAttribute('aria-current');
  }
  if (route.name === 'topic') {
    const button = navTopicsEl.querySelector(`.nav-topic-button[data-route="topic:${route.id}"]`);
    if (!button) return;
    button.setAttribute('aria-current', 'page');
    button.setAttribute('aria-expanded', 'true');
    button.parentElement.querySelector('.nav-questions').classList.remove('hidden');
  } else if (route.name === 'question') {
    const link = navTopicsEl.querySelector(`.nav-question-link[data-route="question:${route.n}"]`);
    if (!link) return;
    link.setAttribute('aria-current', 'page');
    const questionsUl = link.closest('.nav-questions');
    const button = questionsUl?.parentElement.querySelector('.nav-topic-button');
    questionsUl?.classList.remove('hidden');
    button?.setAttribute('aria-expanded', 'true');
  }
}

// --- Illustration (img + onerror fallback, §8) ---

function createIllustration(question) {
  const img = document.createElement('img');
  // Mobile: full-bleed at the card's native 4:3 ratio (via .illustration-frame),
  // image on top of the text below it.
  // Desktop: the card becomes a left/right split (see renderQuestion) — the
  // image fills the entire left column's height (whatever height the text
  // column ends up needing), so it switches to h-full/w-full + object-cover.
  img.className = 'illustration-frame w-full object-contain md:h-full md:w-full md:object-cover';
  img.width = 1200;
  img.height = 900;
  img.alt = `Иллюстрация к вопросу ${question.question_number}`;
  img.dataset.placeholder = PLACEHOLDER_SRC;
  img.src = question.illustration ? illustrationPublicUrl(question.illustration) : PLACEHOLDER_SRC;
  img.addEventListener('error', () => {
    if (img.src.endsWith(PLACEHOLDER_SRC)) return;
    img.src = PLACEHOLDER_SRC;
  });
  return img;
}

// --- Small UI helpers shared across screens ---

/** Chevron used both as a "drill in" affordance and for back/prev/next nav. */
function chevronIcon(direction = 'right', extraClass = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('shrink-0');
  if (direction === 'left') svg.classList.add('-scale-x-100');
  if (extraClass) svg.classList.add(...extraClass.split(' '));
  svg.innerHTML =
    '<path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
  return svg;
}

/** Rounded surface list used for "оглавление" / topic question lists — each
 * row is a full-width tap target with a trailing chevron signalling that it
 * drills into another screen (topics → questions → question). */
function createDrillList() {
  const list = document.createElement('ul');
  list.className = 'overflow-hidden rounded-lg bg-md-surface-container shadow-e1';
  return list;
}

function createDrillItem(href, contentNodes) {
  const li = document.createElement('li');
  li.className = 'border-b border-md-outline/15 last:border-b-0';
  const link = document.createElement('a');
  link.href = href;
  link.className =
    'flex min-h-[56px] items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-md-surface-tint/25 focus-visible:bg-md-surface-tint/25 focus-visible:outline-none';
  const content = document.createElement('span');
  content.className = 'flex min-w-0 items-center gap-3';
  content.append(...contentNodes);
  link.append(content, chevronIcon('right', 'text-md-outline'));
  li.appendChild(link);
  return li;
}

// --- Page renderers ---

// Reading screens (lists) cap at a comfortable text-column width; the
// question screen becomes a wide left/right split on desktop and needs the
// room. Both variants are literal Tailwind classes here (not built from
// interpolated strings) so the CSS build's content scan picks them up.
const CONTAINER_READING = ['md:max-w-2xl', 'lg:max-w-3xl', 'xl:max-w-4xl', '2xl:max-w-5xl'];
const CONTAINER_SPLIT = ['md:max-w-4xl', 'lg:max-w-5xl', 'xl:max-w-6xl', '2xl:max-w-7xl'];

function setContainerWidth(variant) {
  mainEl.classList.remove(...CONTAINER_READING, ...CONTAINER_SPLIT);
  mainEl.classList.add(...variant);
}

function renderTopic(topicId) {
  setContainerWidth(CONTAINER_READING);
  const topic = getTopic(topicId);
  mainEl.replaceChildren();

  const heading = document.createElement('h2');
  heading.className = 'mb-4 text-xl font-medium';
  heading.textContent = topic.topic_name;
  mainEl.appendChild(heading);

  const list = createDrillList();
  for (const q of questionsForTopic(topicId)) {
    const badge = document.createElement('span');
    badge.className =
      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-md-primary/10 text-sm font-medium text-md-primary';
    badge.textContent = String(q.question_number);
    const content = document.createElement('span');
    content.className = 'truncate';
    content.textContent = q.question_content;
    list.appendChild(createDrillItem(`#/q/${q.question_number}`, [badge, content]));
  }
  mainEl.appendChild(list);
}

function createNavButton(label, targetN, direction) {
  const disabled = targetN === null;
  const el = document.createElement(disabled ? 'span' : 'a');
  if (!disabled) el.href = `#/q/${targetN}`;
  el.className = disabled
    ? 'inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-md-outline/20 px-4 py-2 text-sm font-medium text-md-outline md:px-5 md:py-2.5 md:text-base'
    : 'inline-flex items-center gap-1.5 rounded-full border border-md-outline/40 px-4 py-2 text-sm font-medium text-md-primary transition-colors hover:bg-md-surface-tint/25 md:px-5 md:py-2.5 md:text-base';
  if (disabled) el.setAttribute('aria-disabled', 'true');

  const text = document.createElement('span');
  text.textContent = label;

  if (direction === 'left') el.append(chevronIcon('left'), text);
  else el.append(text, chevronIcon('right'));

  return el;
}

function renderQuestion(n) {
  setContainerWidth(CONTAINER_SPLIT);
  const q = getQuestionWithVerses(n);
  const topic = getTopic(q.topic_id);
  mainEl.replaceChildren();

  // Mobile: image stacked on top of text (plain block flow, unchanged).
  // Desktop (md+): left/right split — image fills the left half's full
  // height, text is vertically centered in the right half. `items-stretch`
  // is what makes the image match the text column's height (see
  // createIllustration's md:h-full/object-cover).
  const card = document.createElement('article');
  card.className =
    'overflow-hidden rounded-lg bg-md-surface-container shadow-e1 md:flex md:items-stretch md:min-h-[460px] lg:min-h-[520px] xl:min-h-[560px]';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'md:w-1/2 md:shrink-0';
  imageWrap.appendChild(createIllustration(q));
  card.appendChild(imageWrap);

  const body = document.createElement('div');
  body.className = 'p-4 md:flex md:w-1/2 md:flex-col md:justify-center md:p-10 lg:p-12';

  const topicLabel = document.createElement('a');
  topicLabel.href = `#/topic/${q.topic_id}`;
  topicLabel.className =
    'inline-block w-fit rounded-full bg-md-secondary/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-md-secondary transition-colors hover:bg-md-secondary/25 md:text-sm';
  topicLabel.textContent = topic?.topic_name ?? '';
  body.appendChild(topicLabel);

  const heading = document.createElement('h2');
  heading.className = 'mt-3 text-xl font-medium leading-snug md:text-3xl lg:text-4xl';
  heading.textContent = `${q.question_number}. ${q.question_content}`;
  body.appendChild(heading);

  const answer = document.createElement('p');
  answer.className = 'mt-3 text-base leading-relaxed md:text-xl lg:text-2xl';
  answer.textContent = q.answer;
  body.appendChild(answer);

  if (q.verses.length > 0) {
    const verseList = document.createElement('ul');
    verseList.className = 'mt-4 space-y-3 border-t border-md-outline/15 pt-4 md:mt-6 md:space-y-4 md:pt-6';
    for (const verse of q.verses) {
      const li = verseBlockTpl.content.firstElementChild.cloneNode(true);
      li.className = 'verse-item border-l-4 border-md-secondary/40 pl-3 md:pl-4';
      const textEl = li.querySelector('.verse-text');
      if (verse.text) {
        textEl.textContent = `«${verse.text}»`;
        textEl.className = 'verse-text italic leading-relaxed md:text-xl lg:text-2xl';
      } else {
        textEl.remove();
      }
      const refEl = li.querySelector('.verse-reference');
      refEl.textContent = verse.reference;
      refEl.className = 'verse-reference mt-1 block text-sm not-italic text-md-secondary md:text-base lg:text-lg';
      verseList.appendChild(li);
    }
    body.appendChild(verseList);
  }

  card.appendChild(body);
  mainEl.appendChild(card);

  const nav = document.createElement('div');
  nav.className = 'mt-6 flex items-center justify-between gap-3 md:mt-8';
  nav.appendChild(createNavButton('Предыдущий', n > MIN_QUESTION ? n - 1 : null, 'left'));
  nav.appendChild(createNavButton('Следующий', n < MAX_QUESTION ? n + 1 : null, 'right'));
  mainEl.appendChild(nav);
}

function renderLoadError(message) {
  mainEl.replaceChildren();
  const p = document.createElement('p');
  p.className = 'text-base';
  p.textContent = `Не удалось загрузить данные катехизиса: ${message}`;
  mainEl.appendChild(p);
}

// --- Hash router (§3.1) ---
// No dedicated "home"/table-of-contents route: the sidebar already lists
// every topic and question, so a duplicate listing screen would just repeat
// it. "#/" (and anything invalid) redirects straight into the first question.

const HOME_HASH = '#/q/1';

function parseHash() {
  const hash = window.location.hash || '#/';
  if (hash === '#/') return { name: 'redirect-home' };
  let match = hash.match(/^#\/topic\/(\d+)$/);
  if (match) return { name: 'topic', id: Number(match[1]) };
  match = hash.match(/^#\/q\/(\d+)$/);
  if (match) return { name: 'question', n: Number(match[1]) };
  return { name: 'invalid' };
}

function router() {
  const route = parseHash();

  if (route.name === 'invalid' || route.name === 'redirect-home') {
    window.location.hash = HOME_HASH;
    return;
  }
  if (route.name === 'topic' && !getTopic(route.id)) {
    window.location.hash = HOME_HASH;
    return;
  }
  if (
    route.name === 'question' &&
    (route.n < MIN_QUESTION || route.n > MAX_QUESTION || !getQuestionWithVerses(route.n))
  ) {
    window.location.hash = HOME_HASH;
    return;
  }

  if (route.name === 'topic') renderTopic(route.id);
  else if (route.name === 'question') renderQuestion(route.n);

  updateActiveNav(route);
}

// --- Init ---

async function init() {
  try {
    const res = await fetch('data/catechism.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    initCatechism(await res.json());
  } catch (err) {
    renderLoadError(err.message);
    return;
  }

  renderNavTopics();
  window.addEventListener('hashchange', router);
  router();
}

document.addEventListener('DOMContentLoaded', init);
