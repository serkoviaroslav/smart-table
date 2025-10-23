import { createComparison, rules } from "../lib/compare.js";

/**
 * Поиск по нескольким полям.
 * @param {Object} elements - элементы шаблона search (если нужно, можно использовать позже)
 * @param {string} searchField - имя поля в state, откуда брать строку поиска (например, "search")
 */
export function initSearching(elements, searchField = "search") {
  // Используем только стандартное правило "skipEmptyTargetValues"
  // + кастомное правило поиска по нескольким полям:
  // fields: date, customer, seller; последний аргумент false — согласно методичке
  const compare = createComparison(
    ["skipEmptyTargetValues"],
    [rules.searchMultipleFields(searchField, ["date", "customer", "seller"], false)]
  );

  return (data, state /* , action */) => {
    // Нормализуем значение поиска (чуть безопаснее)
    if (typeof state[searchField] === "string") {
      state[searchField] = state[searchField].trim();
    }

    // Фильтруем строки по компаратору
    return data.filter((row) => compare(row, state));
  };
}