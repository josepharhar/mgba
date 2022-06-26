import MgbaMenu from './menu.js';

export default class MgbaInit extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    const header = document.createElement('h2');
    header.textContent = 'loading mGBA...';
    this.shadowRoot.appendChild(header);
  }

  connectedCallback() {
    window.mgbaModule = {
      //canvas: (function() { return document.getElementById('canvas'); })()
      canvas: document.getElementById('canvas')
    };
    mGBA(window.mgbaModule).then(() => {
      const parent = this.parentNode;
      this.remove();
      parent.appendChild(document.createElement('mgba-menu'));
    });
  }
};

customElements.define('mgba-init', MgbaInit);
