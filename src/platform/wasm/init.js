import MgbaMenu from './menu.js';
import * as FileLoader from './fileloader.js';

export default class MgbaInit extends HTMLElement {
  async connectedCallback() {
    const loading = document.createElement('h2');
    loading.textContent = 'Loading mGBA...';
    this.appendChild(loading);

    if (!window.Module)
      window.Module = {};
    try {
      await mGBA(window.Module);
    } catch (error) {
      console.log('mGBA() failed! ', error);
      loading.textContent = 'mGBA() failed! error: ' + error;
      return;
    }

    // set up filesystem
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

    this.remove();
    document.body.appendChild(document.createElement('mgba-menu'));
  }
}

customElements.define('mgba-init', MgbaInit);
