export default class MgbaTouchControls extends HTMLElement {
  constructor() {
    this.attachShadow({mode: 'open'});

    const style = document.createElement('style');
    style.textContent = `
      .container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
      }
    `;
    this.shadowRoot.appendChild(style);

    const container = document.createElement('div');
    container.classList.add('container');
    this.shadowRoot.appendChild(container);

    const menu = document.createElement('div');
    menu.classList.add('menu');
    container.appendChild(menu);
  }

  connectedCallback() {
    this.style = 'display:contents';
  }
};

customElements.define('mgba-touch-controls', MgbaTouchControls);
