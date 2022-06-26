import MgbaMenu from './menu.js';

export default class MgbaInit extends HTMLElement {
  constructor() {
    this.attachShadow({mode: 'open'});
    const header = document.createElement('h2');
    header.textContent = 'loading mGBA...';
    this.shadowRoot.appendChild(header);
  }

  connectedCallback() {
    const params = {
      canvas: (function() { return document.getElementById('canvas'); })()
    }
    mGBA(params).then(module => {
      //document.getElementById('version').textContent = Module.version.projectName + ' ' + Module.version.projectVersion;
    });
  }
};

customElements.define('mgba-init', MgbaInit);
