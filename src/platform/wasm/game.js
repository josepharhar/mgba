import * as FileLoader from './fileloader.js';

export default class MgbaGame extends HTMLElement {
  connectedCallback() {
    this.canvas.classList.remove('disabled');

    if (!this.file)
      throw new Error('this.file not defined! this: ', this);
    FileLoader.loadFile(this.file);
  }

  disconnectedCallback() {
    this.canvas.classList.add('disabled');
  }

  get canvas() {
    return document.getElementById('canvas');
  }
};

customElements.define('mgba-game', MgbaGame);
