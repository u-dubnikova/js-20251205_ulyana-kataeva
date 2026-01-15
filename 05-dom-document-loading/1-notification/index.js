export default class NotificationMessage {
  static active = null;

  constructor(message = '', {duration = 2000, type = 'success'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.element = document.createElement('div');
    this.element.className = `notification ${type}`;
    this.element.style.setProperty('--value', `${duration}ms`);

    this.element.innerHTML = `
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${type}</div>
        <div class="notification-body">${message}</div>
      </div>
    `;

    this.timerId = null;
  }

  show(container = document.body) {
    if (NotificationMessage.active) {
      NotificationMessage.active.destroy();
    }
    NotificationMessage.active = this;

    container.append(this.element);
    this.timerId = setTimeout(() => this.hide(), this.duration);

    return this.element;
  }

  remove() {
    this.element.remove();
  }

  hide() {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;

    this.remove();

    if (NotificationMessage.active === this) {
      NotificationMessage.active = null;
    }
  }

  destroy() {
    this.hide();
  }
}
