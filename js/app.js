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
mqDesktop.addEventListener('change', (event) => {
  if (event.matches) closeDrawer();
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
  img.className = 'illustration-frame w-full rounded-lg object-contain';
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

// --- Page renderers ---

function renderHome() {
  mainEl.replaceChildren();

  const heading = document.createElement('h2');
  heading.className = 'mb-4 text-xl font-medium';
  heading.textContent = 'Содержание';
  mainEl.appendChild(heading);

  const list = document.createElement('ul');
  list.className = 'overflow-hidden rounded-lg';
  list.style.backgroundColor = 'var(--md-sys-color-surface-container)';
  list.style.boxShadow = 'var(--md-elevation-1)';
  for (const topic of allTopics()) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#/topic/${topic.topic_id}`;
    link.className = 'flex min-h-[44px] items-center px-4 py-3';
    link.textContent = topic.topic_name;
    li.appendChild(link);
    list.appendChild(li);
  }
  mainEl.appendChild(list);
}

function renderTopic(topicId) {
  const topic = getTopic(topicId);
  mainEl.replaceChildren();

  const back = document.createElement('a');
  back.href = '#/';
  back.className = 'mb-4 inline-block text-sm';
  back.style.color = 'var(--md-sys-color-primary)';
  back.textContent = '← К оглавлению';
  mainEl.appendChild(back);

  const heading = document.createElement('h2');
  heading.className = 'mb-4 text-xl font-medium';
  heading.textContent = topic.topic_name;
  mainEl.appendChild(heading);

  const list = document.createElement('ul');
  list.className = 'overflow-hidden rounded-lg';
  list.style.backgroundColor = 'var(--md-sys-color-surface-container)';
  list.style.boxShadow = 'var(--md-elevation-1)';
  for (const q of questionsForTopic(topicId)) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#/q/${q.question_number}`;
    link.className = 'flex min-h-[44px] items-center gap-2 px-4 py-3';
    const num = document.createElement('span');
    num.textContent = `${q.question_number}.`;
    const content = document.createElement('span');
    content.textContent = q.question_content;
    link.append(num, content);
    li.appendChild(link);
    list.appendChild(li);
  }
  mainEl.appendChild(list);
}

function createNavLink(label, targetN) {
  if (targetN === null) {
    const span = document.createElement('span');
    span.setAttribute('aria-disabled', 'true');
    span.style.color = 'var(--md-sys-color-outline)';
    span.textContent = label;
    return span;
  }
  const link = document.createElement('a');
  link.href = `#/q/${targetN}`;
  link.style.color = 'var(--md-sys-color-primary)';
  link.textContent = label;
  return link;
}

function renderQuestion(n) {
  const q = getQuestionWithVerses(n);
  const topic = getTopic(q.topic_id);
  mainEl.replaceChildren();

  mainEl.appendChild(createIllustration(q));

  const topicLabel = document.createElement('a');
  topicLabel.href = `#/topic/${q.topic_id}`;
  topicLabel.className = 'mt-4 inline-block text-sm uppercase tracking-wide';
  topicLabel.style.color = 'var(--md-sys-color-secondary)';
  topicLabel.textContent = topic?.topic_name ?? '';
  mainEl.appendChild(topicLabel);

  const heading = document.createElement('h2');
  heading.className = 'mt-1 text-xl font-medium';
  heading.textContent = `${q.question_number}. ${q.question_content}`;
  mainEl.appendChild(heading);

  const answer = document.createElement('p');
  answer.className = 'mt-3 text-base leading-relaxed';
  answer.textContent = q.answer;
  mainEl.appendChild(answer);

  if (q.verses.length > 0) {
    const verseList = document.createElement('ul');
    verseList.className = 'mt-4 space-y-3';
    for (const verse of q.verses) {
      const li = verseBlockTpl.content.firstElementChild.cloneNode(true);
      const textEl = li.querySelector('.verse-text');
      if (verse.text) {
        textEl.textContent = `«${verse.text}»`;
      } else {
        textEl.remove();
      }
      li.querySelector('.verse-reference').textContent = verse.reference;
      verseList.appendChild(li);
    }
    mainEl.appendChild(verseList);
  }

  const nav = document.createElement('div');
  nav.className = 'mt-6 flex items-center justify-between';
  nav.appendChild(createNavLink('← Предыдущий', n > MIN_QUESTION ? n - 1 : null));
  nav.appendChild(createNavLink('Следующий →', n < MAX_QUESTION ? n + 1 : null));
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

function parseHash() {
  const hash = window.location.hash || '#/';
  if (hash === '#/') return { name: 'home' };
  let match = hash.match(/^#\/topic\/(\d+)$/);
  if (match) return { name: 'topic', id: Number(match[1]) };
  match = hash.match(/^#\/q\/(\d+)$/);
  if (match) return { name: 'question', n: Number(match[1]) };
  return { name: 'invalid' };
}

function router() {
  const route = parseHash();

  if (route.name === 'invalid') {
    window.location.hash = '#/';
    return;
  }
  if (route.name === 'topic' && !getTopic(route.id)) {
    window.location.hash = '#/';
    return;
  }
  if (
    route.name === 'question' &&
    (route.n < MIN_QUESTION || route.n > MAX_QUESTION || !getQuestionWithVerses(route.n))
  ) {
    window.location.hash = '#/';
    return;
  }

  if (route.name === 'home') renderHome();
  else if (route.name === 'topic') renderTopic(route.id);
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
