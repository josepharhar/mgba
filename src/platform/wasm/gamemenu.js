//import * as idb from './node_modules/idb-keyval/dist/index.js';
//import * as idb from './node_modules/idb/build/index.js';
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

    // Maybe .sav files are always written to when you actually save in the game, so none of the below is needed?
    /*const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    dialog.appendChild(saveButton);
    saveButton.onclick = async () => {
      saveButton.disabled = true;
      console.log('saving...');

      // TODO indexedb is already being used for save files and save states, we just have to poke the c++ to make it save.
      // const save = Module.getSave();
      // await idb.set(window.Module.saveName, save);

      console.log('saving complete');
      saveButton.disabled = false;
    };*/

    const saveStateButton = document.createElement('button');
    saveStateButton.textContent = 'Save State';
    dialog.appendChild(saveStateButton);
    saveStateButton.onclick = () => {
      window.Module._saveState();
    };

    const loadStateButton = document.createElement('button');
    loadStateButton.textContent = 'Load State';
    dialog.appendChild(loadStateButton);
    loadStateButton.onclick = () => {
      window.Module._loadState();
    };

    const settingsButton = document.createElement('button');
    settingsButton.textContent = 'Settings';
    settingsButton.onclick = () => {
      this.remove();
      document.body.appendChild(document.createElement('mgba-settings-dialog'));
    };
    dialog.appendChild(settingsButton);

    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    dialog.appendChild(quitButton);
    quitButton.onclick = () => console.log('TODO');

    dialog.showModal();
  }
};

customElements.define('mgba-game-menu', MgbaGameMenu);
