import * as FileLoader from './fileloader.js';

export default class MgbaGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.canvas = document.getElementById('canvas');
  }

  connectedCallback() {
    this.style = 'display:block; background-color: black';
    //this.appendChild(this.canvas);
    this.canvas.classList.remove('disabled');

    if (!this.file)
      throw new Error('this.file not defined! this: ', this);
    FileLoader.loadFile(this.file);
  }

  disconnectedCallback() {
    this.canvas.classList.add('disabled');
    document.body.appendChild(this.canvas);
  }
};

customElements.define('mgba-game', MgbaGame);
