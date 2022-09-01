import MgbaSettingsDialog from './settings.js';
import MgbaInit from './init.js';

async function syncfs() {
  const err = await new Promise(resolve => {
    window.Module.FS.syncfs(resolve);
  });
  if (err)
    console.log('syncfs error: ', err);
}

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
      await syncfs();
      saveButton.disabled = false;
    };

    const saveStateButton = document.createElement('button');
    saveStateButton.textContent = 'Save State';
    dialog.appendChild(saveStateButton);
    saveStateButton.onclick = async () => {
      saveStateButton.disabled = true;
      window.Module._saveState(1);
      await syncfs();
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
      if (timing == MgbaInit.mainLoopTiming) {
        window.Module._setMainLoopTiming(0, MgbaInit.fastLoopTiming);
      } else if (timing == MgbaInit.fastLoopTiming) {
        window.Module._setMainLoopTiming(0, MgbaInit.mainLoopTiming);
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
    quitButton.onclick = () => console.log('TODO');

    dialog.showModal();
  }
};

customElements.define('mgba-game-menu', MgbaGameMenu);
