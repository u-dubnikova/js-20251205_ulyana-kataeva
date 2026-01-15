export default class SortableTable {
  element;
  subElements = {};
  data = [];

  constructor(headerConfig = [], data = [], sorted = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.sorted = {
      id: sorted.id ?? null,
      order: sorted.order ?? 'asc'
    };

    this.arrow = this.createArrow();
    this.render();

    if (this.sorted.id) this.sort(this.sorted.id, this.sorted.order);
    else this.toggleEmpty();
  }

  createArrow() {
    const el = document.createElement('span');
    el.dataset.element = 'arrow';
    el.className = 'sortable-table__sort-arrow';
    el.innerHTML = '<span class="sort-arrow"></span>'; // JSX -> строка
    return el;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.subElements.arrow = this.arrow;
  }

  template() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.headerConfig.map(c => `
            <div class="sortable-table__cell"
                 data-id="${c.id}"
                 data-sortable="${c.sortable}">
              <span>${c.title}</span>
            </div>
          `).join('')}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.renderRows(this.data)}
        </div>

        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    `;
  }

  renderRows(data) {
    return data.map(item => `
      <a href="${item?.id ? `/products/${item.id}` : '#'}" class="sortable-table__row">
        ${this.headerConfig.map(col => this.renderCell(col, item)).join('')}
      </a>
    `).join('');
  }

  renderCell(col, item) {
    if (typeof col.template === 'function') {
      return col.template(item[col.id], item);
    }

    return `<div class="sortable-table__cell">${item[col.id] ?? ''}</div>`;
  }

  sort(field, order = 'asc') {
    const col = this.headerConfig.find(c => c.id === field);
    if (!col || !col.sortable) return;

    const dir = order === 'desc' ? -1 : 1;

    const sortedData = [...this.data].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (col.sortType === 'number') return dir * ((aVal ?? 0) - (bVal ?? 0));
      if (col.sortType === 'date') return dir * (new Date(aVal) - new Date(bVal));

      return dir * String(aVal ?? '').localeCompare(String(bVal ?? ''), ['ru', 'en'], {
        sensitivity: 'variant',
        caseFirst: 'upper'
      });
    });

    this.subElements.body.innerHTML = this.renderRows(sortedData);
    this.updateHeader(field, order);
    this.toggleEmpty();
  }

  updateHeader(field, order) {
    this.subElements.header.querySelectorAll('.sortable-table__cell').forEach(cell => {
      if (cell.dataset.id === field) {
        cell.dataset.order = order;
        cell.append(this.arrow);

      } else {
        delete cell.dataset.order;
      }
    });
  }

  toggleEmpty() {
    if (!this.subElements.emptyPlaceholder) return;
    this.subElements.emptyPlaceholder.style.display = this.data.length ? 'none' : '';
  }

  getSubElements(element) {
    const res = {};
    element.querySelectorAll('[data-element]').forEach(el => (res[el.dataset.element] = el));
    return res;
  }

  destroy() {
    this.element?.remove();
    this.element = null;
    this.subElements = {};
  }
}
