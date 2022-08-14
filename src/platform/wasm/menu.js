import MgbaGame from './game.js';
import MgbaSettingsDialog from './settings.js';

export default class MgbaMenu extends HTMLElement {
  connectedCallback() {
    const filepicker = document.createElement('button');
    filepicker.textContent = 'pick a GBA ROM file...';
    this.appendChild(filepicker);
    filepicker.onclick = () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.click();
      fileInput.onchange = () => {
        // TODO check to make sure the file is valid first?
        this.remove();
        const game = document.createElement('mgba-game');
        game.file = fileInput.files[0];
        document.body.appendChild(game);
      };
    };

    const settingsButton = document.createElement('button');
    settingsButton.classList.add('settings');
    settingsButton.textContent = 'Settings';
    this.appendChild(settingsButton);
    settingsButton.onclick = () => {
      document.body.appendChild(document.createElement('mgba-settings-dialog'));
    };
  }
};

customElements.define('mgba-menu', MgbaMenu);
