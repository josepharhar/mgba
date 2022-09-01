import * as FileLoader from './fileloader.js';
import MgbaGameLoader from './gamemenu.js';

// TODO I wonder if i could have an integration test for these mappings...
const buttonNameToId = new Map();
buttonNameToId.set('a', 0);
buttonNameToId.set('b', 1);
buttonNameToId.set('select', 2);
buttonNameToId.set('start', 3);
buttonNameToId.set('right', 4);
buttonNameToId.set('left', 5);
buttonNameToId.set('up', 6);
buttonNameToId.set('down', 7);
buttonNameToId.set('r', 8);
buttonNameToId.set('l', 9);
const buttonIdToName = new Map();
for (const [key, value] of buttonNameToId) {
  buttonIdToName.set(value, key);
}

export default class MgbaGame extends HTMLElement {
  // Use setTimeout with 16ms delays for 60fps.
  // Ideally this would be 16.6666, but this has to be an integer...
  static mainLoopTiming = 16;
  static fastLoopTiming = 8;

  connectedCallback() {
    this.addButtons();

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

    if (!window.Module)
      window.Module = {};
    window.Module.canvas = this.canvas;
    mGBA(window.Module).then(async () => {
      window.Module._setMainLoopTiming(0, MgbaGame.mainLoopTiming);
      this.placeholder.remove();
      this.canvas.classList.remove('disabled');

      if (!this.file)
        throw new Error('this.file not defined! this: ', this);
      FileLoader.loadFile(this.file);
      
      const autosaveSlot = 0;

      // load save state if we have it
      let filepath = this.file.name;
      filepath = filepath.replace(/\.[^/.]+$/, ""); // remove file extension
      filepath = `/data/states/${filepath}.ss${autosaveSlot}`;
      try {
        console.log('going to call fs.stat, filepath: "' + filepath + '"');
        await FileLoader.syncfs();
        if (window.Module.FS.stat(filepath)) {
          console.log('loading autosave');
          window.Module._loadState(autosaveSlot);
        }
      } catch (e) {
        console.log('fs.stat threw');
        // FS.stat() will throw if the file doesn't exist.
      }

      // auto save state every 2 seconds
      // TODO tweak this interval
      const autosaveMs = 2000;
      const scheduleAutosave = () => {
        this.timeout = setTimeout(async () => {
          window.Module._saveState(autosaveSlot);
          await FileLoader.syncfs();
          scheduleAutosave();
        }, autosaveMs);
      };
      scheduleAutosave();
    });

    if (!this.file)
      throw new Error('this.file not defined! this: ', this);
  }

  disconnectedCallback() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  buttonPress(name) {
    window.Module._buttonPress(buttonNameToId.get(name.toLowerCase()));
  }

  buttonUnpress(name) {
    window.Module._buttonUnpress(buttonNameToId.get(name.toLowerCase()));
  }

  addShoulderRow(container) {
    const shoulderRow = document.createElement('div');
    container.appendChild(shoulderRow);
    shoulderRow.classList.add('shoulder-row');

    const L = document.createElement('div');
    L.classList.add('L');
    shoulderRow.appendChild(L);

    const R = document.createElement('div');
    R.classList.add('R');
    shoulderRow.appendChild(R);
  }

  addControlsRow(container) {
    const controlsRow = document.createElement('div');
    container.appendChild(controlsRow);
    controlsRow.classList.add('controls-row');

    const dpad = document.createElement('div');
    dpad.classList.add('dpad');
    controlsRow.appendChild(dpad);
    for (let i = 0; i < 9; i++) {
      dpad.appendChild(document.createElement('div'));
    }

    const abContainer = document.createElement('div');
    abContainer.classList.add('ab-container');
    controlsRow.appendChild(abContainer);
    abContainer.appendChild(document.createElement('div'));
    const a = document.createElement('div');
    a.classList.add('A');
    abContainer.appendChild(a);
    const b = document.createElement('div');
    b.classList.add('B');
    abContainer.appendChild(b);
    abContainer.appendChild(document.createElement('div'));
  }

  addMenuRow(container) {
    const menuRow = document.createElement('div');
    container.appendChild(menuRow);
    menuRow.classList.add('menu-row');

    const menu = document.createElement('div');
    menu.classList.add('menu');
    menuRow.appendChild(menu);
    menu.onclick = () => {
      this.appendChild(document.createElement('mgba-game-menu'));
    };

    const selectStartContainer = document.createElement('div');
    selectStartContainer.classList.add('select-start-container');
    menuRow.appendChild(selectStartContainer);

    const select = document.createElement('div');
    select.classList.add('select');
    selectStartContainer.appendChild(select);

    const start = document.createElement('div');
    start.classList.add('start');
    selectStartContainer.appendChild(start);

    menuRow.appendChild(document.createElement('div'));
  }

  addButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    this.appendChild(buttonContainer);

    const bufferRow = document.createElement('div');
    buttonContainer.appendChild(bufferRow);
    this.addShoulderRow(buttonContainer);
    this.addControlsRow(buttonContainer);
    this.addMenuRow(buttonContainer);

    const A = this.querySelector('.A');
    const B = this.querySelector('.B');
    const L = this.querySelector('.L');
    const R = this.querySelector('.R');
    const start = this.querySelector('.start');
    const select = this.querySelector('.select');

    [[A, 'A'], [B, 'B'], [L, 'L'], [R, 'R'], [start, 'start'], [select, 'select']].forEach(([element, buttonName]) => {
      ['mousedown', 'touchstart'].forEach(eventName => {
        element.addEventListener(eventName, () => {
          this.buttonPress(element.className);
          element.classList.add('pressed');
        });
      });
      ['mouseup', 'touchend', 'touchcancel'].forEach(eventName => {
        element.addEventListener(eventName, () => {
          this.buttonUnpress(element.className);
          element.classList.remove('pressed');
        });
      });
    });

    const dpad = this.querySelector('.dpad');
    const dpadUpLeft = dpad.children[0];
    const dpadUp = dpad.children[1];
    const dpadUpRight = dpad.children[2];
    const dpadLeft = dpad.children[3];
    const dpadRight = dpad.children[5];
    const dpadDownLeft = dpad.children[6];
    const dpadDown = dpad.children[7];
    const dpadDownRight = dpad.children[8];
    const updateDpad = event => {
      const pressed = {
        Up: false,
        Down: false,
        Left: false,
        Right: false
      };
      switch (event.target) {
        case dpadUpLeft:
          pressed.Left = true;
          pressed.Up = true;
          break;
        case dpadUp:
          pressed.Up = true;
          break;
        case dpadUpRight:
          pressed.Right = true;
          pressed.Up = true;
          break;
        case dpadLeft:
          pressed.Left = true;
          break;
        case dpadRight:
          pressed.Right = true;
          break;
        case dpadDownLeft:
          pressed.Down = true;
          pressed.Left = true;
          break;
        case dpadDown:
          pressed.Down = true;
          break;
        case dpadDownRight:
          pressed.Down = true;
          pressed.Right = true;
          break;
      }
      for (const name of ['Up', 'Down', 'Left', 'Right']) {
        if (pressed[name]) {
          this.buttonPress(name);
        } else {
          this.buttonUnpress(name);
        }
      }
    };
    const clearDpad = () => {
      for (const name of ['Up', 'Down', 'Left', 'Right'])
        this.buttonUnpress(name);
    };
    dpad.onpointermove = event => {
      if (!event.buttons && event.pointerType === 'mouse')
        return;
      updateDpad(event);
    };
    dpad.onpointerdown = event => updateDpad(event);
    dpad.onpointerup = () => clearDpad();
    dpad.onpointerleave = () => clearDpad();
  }
}

customElements.define('mgba-game', MgbaGame);
