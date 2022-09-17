import MgbaMenu from './menu.js';

export default class MgbaInit extends HTMLElement {
  async connectedCallback() {
    const loading = document.createElement('h2');
    loading.textContent = 'Loading mGBA...';
    this.appendChild(loading);

    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.classList.add('disabled');
    document.body.appendChild(canvas);

    if (!window.Module)
      window.Module = {};
    try {
      await mGBA(window.Module);
    } catch (error) {
      console.log('mGBA() failed! ', error);
      loading.textContent = 'mGBA() failed! error: ' + error;
      return;
    }

    this.remove();
    document.body.appendChild(document.createElement('mgba-menu'));
  }
}

customElements.define('mgba-init', MgbaInit);
