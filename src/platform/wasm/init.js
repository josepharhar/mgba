import MgbaMenu from './menu.js';

export default class MgbaInit extends HTMLElement {
  connectedCallback() {
    const header = document.createElement('h2');
    header.textContent = 'loading mGBA...';
    this.appendChild(header);

    if (!window.Module)
      window.Module = {};
    window.Module.canvas = document.getElementById('canvas');
    mGBA(window.Module).then(() => {
      const parent = this.parentNode;
      this.remove();

      // Use setTimeout with 16ms delays for 60fps.
      // Ideally this would be 16.6666, but this has to be an integer...
      window.Module._setMainLoopTiming(0, 16);
      //window.Module.keyDown(12);

      parent.appendChild(document.createElement('mgba-menu'));
    });
  }
};

customElements.define('mgba-init', MgbaInit);
