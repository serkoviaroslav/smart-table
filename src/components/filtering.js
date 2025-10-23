import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  // indexes — объект вида { searchBySeller: { id1: 'Имя', id2: 'Имя2', ... }, ... }
  Object.keys(indexes).forEach((elementName) => {
    const el = elements[elementName];
    if (!el) return;

    const options = Object.values(indexes[elementName]).map((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      return opt;
    });

    el.append(...options);
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    // ожидается кнопка с атрибутами: name="clear" и data-field="имяПоля"
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      if (field) {
        // сбрасываем визуально
        if (elements[field]) elements[field].value = "";
        // и в состоянии
        if (field in state) state[field] = "";
      }
    }

    // @todo: #4.5 — отфильтровать данные, используя компаратор
    return data.filter((row) => compare(row, state));
  };
}