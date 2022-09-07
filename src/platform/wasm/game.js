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

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas';
    this.canvas.setAttribute('width', '240');
    this.canvas.setAttribute('height', '240');
    this.canvas.style = 'cursor: default;';
    this.canvas.classList.add('disabled');
    this.appendChild(this.canvas);

    this.placeholder = document.createElement('div');
    this.appendChild(this.placeholder);
    this.placeholder.classList.add('placeholder');
    const placeholderTitle = document.createElement('h1');
    placeholderTitle.textContent = 'Loading...';
    this.placeholder.appendChild(placeholderTitle);

    if (!this.file) {
      console.error('this.file not defined! this: ', this);
      return;
    }

    window.Module.canvas = this.canvas;
    // TODO window.Module._setMainLoopTiming(0, MgbaGame.mainLoopTiming);
    this.placeholder.remove();
    this.canvas.classList.remove('disabled');

    // set up filesystem, this was moved from main.c
    window.Module.FS.mkdir('/data');
    window.Module.FS.mount(window.Module.FS.filesystems.IDBFS, {}, '/data');
    await FileLoader.readfs();
    // When we read from indexedb, these directories may or may not exist.
    // If we mkdir and they already exist they throw, so just catch all of them.
    try {
      window.Module.FS.mkdir('/data/saves');
    } catch (e) {}
    try {
      window.Module.FS.mkdir('/data/states');
    } catch (e) {}
    try {
      window.Module.FS.mkdir('/data/games');
    } catch (e) {}

    if (!this.file)
      throw new Error('this.file not defined! this: ', this);
    FileLoader.loadFile(this.file);
    
    const autosaveSlot = 0;

    // load save state if we have it
    let filepath = this.file.name;
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
