import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js'; // <-- поиск

// Исходные данные, подготовка индексов
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  // Приводим к числам то, с чем будем считать
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState();   // состояние полей формы
  let result = [...data];       // копия данных для преобразований

  // ПОРЯДОК ПРИМЕНЕНИЯ МОДУЛЕЙ:
  // 1) поиск
  result = applySearching(result, state, action);
  // 2) фильтрация
  result = applyFiltering(result, state, action);
  // 3) сортировка
  result = applySorting(result, state, action);
  // 4) пагинация
  result = applyPagination(result, state, action);

  // Рендер таблицы
  sampleTable.render(result);
}

// --- Инициализация таблицы (подключаем шаблоны) ---
const sampleTable = initTable({
  tableTemplate: 'table',
  rowTemplate: 'row',
  before: ['search', 'header', 'filter'], // <-- search добавлен ПЕРЕД header
  after: ['pagination']
}, render);

// --- Инициализация поиска ---
const applySearching = initSearching(sampleTable.search.elements, 'search');

// --- Инициализация фильтрации ---
const applyFiltering = initFiltering(sampleTable.filter.elements, {
  searchBySeller: indexes.sellers
});

// --- Инициализация сортировки ---
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal
]);

// --- Инициализация пагинации ---
const applyPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector('input');
    const label = el.querySelector('span');
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

// Монтируем в DOM и делаем первый рендер
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();