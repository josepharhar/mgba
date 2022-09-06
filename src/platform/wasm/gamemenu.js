import MgbaSettingsDialog from './settings.js';
import MgbaGame from './game.js';
import * as FileLoader from './fileloader.js';

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

    // TODO call syncfs from C when the save is actually written internally
    // so we can get rid of this button completely.
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    dialog.appendChild(saveButton);
    saveButton.onclick = async () => {
      saveButton.disabled = true;
      await FileLoader.syncfs();
      saveButton.disabled = false;
    };

    const saveStateButton = document.createElement('button');
    saveStateButton.textContent = 'Save State';
    dialog.appendChild(saveStateButton);
    saveStateButton.onclick = async () => {
      saveStateButton.disabled = true;
      window.Module._saveState(1);
      await FileLoader.syncfs();
      saveStateButton.disabled = false;
    };

    const loadStateButton = document.createElement('button');
    loadStateButton.textContent = 'Load State';
    dialog.appendChild(loadStateButton);
    loadStateButton.onclick = () => {
      window.Module._loadState(1);
    };

    const speedToggleButton = document.createElement('button');
    speedToggleButton.textContent = 'Toggle Speed';
    dialog.appendChild(speedToggleButton);
    speedToggleButton.onclick = () => {
      const timing = window.Module._getMainLoopTiming();
      console.log('timing: ' + timing);
      if (timing == MgbaGame.mainLoopTiming) {
        window.Module._setMainLoopTiming(0, MgbaGame.fastLoopTiming);
      } else if (timing == MgbaGame.fastLoopTiming) {
        window.Module._setMainLoopTiming(0, MgbaGame.mainLoopTiming);
      } else {
        console.log('unrecognized timing: ' + timing);
      }
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
    quitButton.onclick = () => {
      try {
        window.Module._quitGame();
      } catch (e) {}
      this.remove();
      document.querySelector('mgba-game').remove();
      document.body.appendChild(document.createElement('mgba-menu'));
    }

    dialog.showModal();
  }
};

customElements.define('mgba-game-menu', MgbaGameMenu);
