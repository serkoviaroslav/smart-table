import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
    before.slice().reverse().forEach(templateId => {
        root[templateId] = cloneTemplate(templateId);
        root.container.prepend(root[templateId].container);
    });

    after.forEach(templateId => {
        root[templateId] = cloneTemplate(templateId);
        root.container.append(root[templateId].container);
    });

    // @todo: #1.3 — обработать события и вызвать onAction()
    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => setTimeout(() => onAction()));
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    const el = row.elements[key];
                    if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
                        el.value = item[key];
                    } else {
                        el.textContent = item[key];
                    }
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}

