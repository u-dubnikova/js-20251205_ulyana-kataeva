const DEFAULT_CHART_HEIGHT = 50;

export default class ColumnChart {
  element;
  subElements = {};

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    chartHeight = DEFAULT_CHART_HEIGHT,
    formatHeading = (v) => v
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.chartHeight = chartHeight;
    this.formatHeading = formatHeading;

    this.render();
  }

  getTemplate() {
    const isLoading = !Array.isArray(this.data) || this.data.length === 0;

    return `
      <div class="column-chart ${isLoading ? 'column-chart_loading' : ''}"
           style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
        </div>

        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading(this.value)}
          </div>

          <div data-element="body" class="column-chart__chart">
            ${isLoading ? this.getSkeleton() : this.getColumns()}
          </div>
        </div>
      </div>
    `;
  }

  getSkeleton() {
    return `<img alt="Loading" src="charts-skeleton.svg">`;
  }

  getColumns() {
    const max = Math.max(...this.data);
    const scale = max > 0 ? this.chartHeight / max : 0;

    return this.data
      .map(value => {
        const height = Math.floor(value * scale); // 0..chartHeight
        const percent = max > 0 ? Math.round((value / max) * 100) : 0;

        // В стилях обычно используется CSS-переменная --value
        return `<div style="--value: ${height}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  update(newData = []) {
    this.data = newData;

    const isLoading = !Array.isArray(this.data) || this.data.length === 0;

    this.element.classList.toggle('column-chart_loading', isLoading);
    this.subElements.body.innerHTML = isLoading ? this.getSkeleton() : this.getColumns();

    return this; // часто удобно; если тесты требуют иначе — уберёте
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const result = {};
    this.element.querySelectorAll('[data-element]').forEach(el => {
      result[el.dataset.element] = el;
    });
    return result;
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
