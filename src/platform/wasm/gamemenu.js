import * as idb from './node_modules/idb-keyval/dist/index.js';
import MgbaSettingsDialog from './settings.js';

export default class MgbaGameMenu extends HTMLElement {
  connectedCallback() {
    const dialog = document.createElement('dialog');
    this.appendChild(dialog);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close menu';
    dialog.appendChild(closeButton);
    closeButton.onclick = () => {
      dialog.close();
      this.remove();
    };

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    dialog.appendChild(saveButton);
    saveButton.onclick = async () => {
      saveButton.disabled = true;
      console.log('saving...');

      const save = Module.getSave();
      await idb.set(window.Module.saveName, save);

      console.log('saving complete');
      saveButton.disabled = false;
    };

    const settingsButton = document.createElement('button');
    settingsButton.textContent = 'Settings';
    settingsButton.onclick = () => {
      this.remove();
      document.body.appendChild(document.createElement('mgba-settings-dialog'));
    };

    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    dialog.appendChild(quitButton);
    quitButton.onclick = () => console.log('TODO');

    dialog.showModal();
  }
};

customElements.define('mgba-game-menu', MgbaGameMenu);
