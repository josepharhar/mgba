import MgbaGame from './game.js';
import * as FileLoader from './fileloader.js';

export default class MgbaMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    this.shadowRoot.appendChild(fileInput);
    fileInput.onchange = () => {
      FileLoader.loadFile(fileInput.files[0]);
    };
  }
};

customElements.define('mgba-menu', MgbaMenu);
