const filters = document.querySelector('.filters');
const form = document.querySelector('.menu-search');
const search = form.querySelector('input');
const grid = document.querySelector('.menu-grid');
const empty = document.querySelector('.empty');
const results = document.querySelector('.results');
const more = document.querySelector('.menu-more');
const batchSize = 8;
const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const catalog = 'https://ema-prospekt-aleksandra-suvorova.clients.site/service/';
const filterOptions = [{ id: 'all', label: 'Всё меню' }, ...menuGroups];
const dishes = menuGroups.flatMap(group => group.items.map(([title, description, price, photo, source]) => ({
  group: group.id, title, description, price, source,
  photo: `assets/menu/${photo}`,
})));

let category = 'all';
let matches = [];

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content) node.textContent = content;
  return node;
}

function normalize(value) {
  return value.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').trim();
}

function card(dish) {
  const article = element('article', 'dish');
  const image = element('img');
  image.src = dish.photo;
  image.alt = '';
  image.width = 432;
  image.height = 320;
  image.loading = 'lazy';
  image.decoding = 'async';

  const copy = element('div', 'dish-info');
  const meta = element('div', 'dish-meta');
  meta.append(element('strong', '', money.format(dish.price)));
  if (dish.source) {
    const citation = element('a', 'underlined', 'Источник цены');
    citation.href = catalog + dish.source;
    citation.setAttribute('aria-label', `Источник цены: ${dish.title}`);
    const source = element('small');
    source.append(citation);
    meta.append(source);
  } else {
    meta.append(element('small', '', 'Пример'));
  }

  copy.append(element('h3', '', dish.title), element('p', '', dish.description), meta);
  article.append(image, copy);
  return article;
}

function render() {
  const query = normalize(search.value);
  matches = dishes.filter(dish => (category === 'all' || category === dish.group) && normalize(dish.title).includes(query));
  for (const button of filters.children) {
    button.setAttribute('aria-pressed', String(button.dataset.category === category));
  }
  grid.replaceChildren();
  empty.hidden = matches.length > 0;
  addBatch();
}

function addBatch(moveFocus = false) {
  const start = grid.children.length;
  grid.append(...matches.slice(start, start + batchSize).map(card));
  if (moveFocus) {
    const firstNew = grid.children[start]?.querySelector('h3');
    if (firstNew) {
      firstNew.tabIndex = -1;
      firstNew.focus();
    }
  }
  const shown = grid.children.length;
  more.hidden = shown === matches.length;
  results.textContent = shown === matches.length ? `Позиций: ${shown}` : `Показано ${shown} из ${matches.length}`;
}

filters.append(...filterOptions.map(filter => {
  const button = element('button', 'button button-outline', filter.label);
  button.type = 'button';
  button.dataset.category = filter.id;
  return button;
}));

filters.addEventListener('click', event => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  category = button.dataset.category;
  render();
});
form.addEventListener('submit', event => event.preventDefault());
search.addEventListener('input', render);
more.addEventListener('click', () => addBatch(true));
document.querySelectorAll('[data-menu-category]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    category = link.dataset.menuCategory;
    search.value = '';
    render();
  });
});
document.querySelector('.reset').addEventListener('click', () => {
  category = 'all';
  search.value = '';
  render();
  search.focus();
});
form.hidden = false;
render();
