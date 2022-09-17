import MgbaGame from './game.js';
import MgbaSettingsDialog from './settings.js';
import * as FileLoader from './fileloader.js';

export default class MgbaMenu extends HTMLElement {
  async connectedCallback() {
    const filepicker = document.createElement('button');
    filepicker.textContent = 'pick a GBA ROM file...';
    this.appendChild(filepicker);
    filepicker.onclick = () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.click();
      fileInput.onchange = () => {
        const file = fileInput.files[0];
        const filepath = `/data/games/${file.name}`;
        FileLoader.saveFile(filepath, file);

        this.remove();
        const game = document.createElement('mgba-game');
        game.name = file.name;
        document.body.appendChild(game);
      };
    };

    const games = window.Module.FS.readdir('/data/games');
    games.splice(games.indexOf('.'), 1);
    games.splice(games.indexOf('..'), 1);

    if (games.length) {
      const title = document.createElement('h3');
      title.textContent = 'Saved ROMs:';
      this.appendChild(title);
    }
    for (const gameName of games) {
      const button = document.createElement('button');
      button.textContent = gameName;
      this.appendChild(button);
      button.onclick = () => {
        this.remove();
        const mgbaGame = document.createElement('mgba-game');
        mgbaGame.name = gameName;
        document.body.appendChild(mgbaGame);
      };
    }

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
