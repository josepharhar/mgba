import MgbaGame from './game.js';

export default class MgbaMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    const header = document.createElement('h2');
    header.textContent = 'pick a GBA ROM file.';
    this.shadowRoot.appendChild(header);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    this.shadowRoot.appendChild(fileInput);
    fileInput.onchange = () => {
      // TODO check to make sure the file is valid first?
      this.remove();
      const game = document.createElement('mgba-game');
      game.file = fileInput.files[0];
      document.body.appendChild(game);
    };
  }
};

customElements.define('mgba-menu', MgbaMenu);
