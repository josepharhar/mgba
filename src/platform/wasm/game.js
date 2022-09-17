import * as FileLoader from './fileloader.js';
import MgbaGameLoader from './gamemenu.js';
import MgbaControls from './controls.js';

export default class MgbaGame extends HTMLElement {
  // Use setTimeout with 16ms delays for 60fps.
  // Ideally this would be 16.6666, but this has to be an integer...
  static mainLoopTiming = 16;
  static fastLoopTiming = 8;

  async connectedCallback() {
    this.appendChild(document.createElement('mgba-controls'));

    //this.canvas = document.createElement('canvas');
    //this.canvas.id = 'canvas';
    this.canvas = document.getElementById('canvas');
    this.canvas.setAttribute('width', '240');
    this.canvas.setAttribute('height', '240');
    this.canvas.style = 'cursor: default;';
    //this.canvas.classList.add('disabled');
    this.appendChild(this.canvas);

    this.placeholder = document.createElement('div');
    this.appendChild(this.placeholder);
    this.placeholder.classList.add('placeholder');
    const placeholderTitle = document.createElement('h1');
    placeholderTitle.textContent = 'Loading...';
    this.placeholder.appendChild(placeholderTitle);

    window.Module.canvas = this.canvas;
    // TODO window.Module._setMainLoopTiming(0, MgbaGame.mainLoopTiming);
    this.placeholder.remove();
    this.canvas.classList.remove('disabled');

    if (!this.name)
      throw new Error('this.namenot defined! this: ', this);

    const romFilepath = `/data/games/${this.name}`;
    FileLoader.loadGame(romFilepath);
    
    const autosaveSlot = 0;

    // load save state if we have it
    let filepath = this.name;
    filepath = filepath.replace(/\.[^/.]+$/, ""); // remove file extension
    filepath = `/data/states/${filepath}.ss${autosaveSlot}`;
    try {
      await FileLoader.writefs();
      if (window.Module.FS.stat(filepath)) {
        window.Module._loadState(autosaveSlot);
      }
    } catch (e) {
      // FS.stat() will throw if the file doesn't exist.
    }

    // auto save state every 2 seconds
    // TODO tweak this interval
    // TODO make this a setting in case people dont like autosaves
    const autosaveMs = 2000;
    const scheduleAutosave = () => {
      this.timeout = setTimeout(async () => {
        window.Module._saveState(autosaveSlot);
        await FileLoader.writefs();
        scheduleAutosave();
      }, autosaveMs);
    };
    scheduleAutosave();
  }

  disconnectedCallback() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

customElements.define('mgba-game', MgbaGame);
