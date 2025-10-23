import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки
      // Ротируем состояние кнопки по карте переходов и читаем нужные значения
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // @todo: #3.2 — сбросить сортировки остальных колонок
      columns.forEach((col) => {
        if (col !== action) col.dataset.value = "none";
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки (если уже выбрана ранее)
      columns.forEach((col) => {
        if (col.dataset.value !== "none") {
          field = col.dataset.field;
          order = col.dataset.value;
        }
      });
    }

    // Если сортировка не выбрана — возвращаем данные как есть
    if (!field || order === "none") return data;

    // Применяем выбранную сортировку
    return sortCollection(data, field, order);
  };
}