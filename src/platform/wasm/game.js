import * as FileLoader from './fileloader.js';

// TODO I wonder if i could have an integration test for these mappings...
const buttonNameToId = new Map();
buttonNameToId.set('A', 0);
buttonNameToId.set('B', 1);
buttonNameToId.set('Select', 2);
buttonNameToId.set('Start', 3);
buttonNameToId.set('Right', 4);
buttonNameToId.set('Left', 5);
buttonNameToId.set('Up', 6);
buttonNameToId.set('Down', 7);
buttonNameToId.set('R', 8);
buttonNameToId.set('L', 9);
const buttonIdToName = new Map();
for (const [key, value] of buttonNameToId) {
  buttonIdToName.set(value, key);
}

export default class MgbaGame extends HTMLElement {
  connectedCallback() {
    this.addButtons();

    this.canvas.classList.remove('disabled');

    if (!this.file)
      throw new Error('this.file not defined! this: ', this);
    FileLoader.loadFile(this.file);
  }

  disconnectedCallback() {
    this.canvas.classList.add('disabled');
  }

  get canvas() {
    return document.getElementById('canvas');
  }

  buttonPress(name) {
    window.Module._buttonPress(buttonNameToId.get(name));
  }

  buttonUnpress(name) {
    window.Module._buttonUnpress(buttonNameToId.get(name));
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

    const bufferRow = document.createElement('div');
    buttonContainer.appendChild(bufferRow);
    this.addShoulderRow(buttonContainer);
    this.addControlsRow(buttonContainer);
    this.addMenuRow(buttonContainer);






    /*for (const name of ['B', 'A', 'Select', 'Start']) {
      const button = document.createElement('div');
      button.classList.add('fake-button');
      button.classList.add(name);
      buttonContainer.appendChild(button);
      // TODO replace all mouse and touch events with pointer events which count for both
      // TODO these used to have event.preventDefault. Should I add it back?
      button.onmousedown = event => {
        this.buttonPress(name);
        button.classList.add('pressed');
      };
      button.onmouseup = button.onmouseout = event => {
        this.buttonUnpress(name);
        button.classList.remove('pressed');
      }
      button.ontouchstart = event => {
        this.buttonPress(name);
        button.classList.add('pressed');
      };
      button.ontouchend = button.ontouchcancel = button.ontouchend = event => {
        this.buttonUnpress(name);
        button.classList.remove('pressed');
      };
    }
    const dpad = document.createElement('div');
    dpad.classList.add('d-pad');
    buttonContainer.appendChild(dpad);
    dpad.onpointermove = event => {
      if (!event.buttons && event.pointerType === 'mouse')
        return;
      updateDpad(event);
    };
    dpad.onpointerup = event => {
      clearDpad();
    };
    dpad.onpointerdown = event => {
      updateDpad(event);
      event.preventDefault();
    };
    dpad.onpointerenter = event => {
      if (!event.buttons && event.pointerType === 'mouse')
        return;
      updateDpad(event);
    };
    dpad.onpointerleave = event => {
      clearDpad();
    };
    const updateDpad = (event) => {
      const pressed = {
        Left: false,
        Right: false,
        Up: false,
        Down: false,
      }
      // The inner 15x15 should be a dead zone
      // The whole thing is 112x112
      const deadzoneWidth = 22;
      const lowerThreshold = (dpad.offsetWidth / 2) - (deadzoneWidth / 2);
      const upperThreshold = (dpad.offsetWidth / 2) + (deadzoneWidth / 2);
      if (event.offsetX < lowerThreshold) {
        pressed.Left = true;
      } else if (event.offsetX > upperThreshold) {
        pressed.Right = true;
      }
      if (event.offsetY < lowerThreshold) {
        pressed.Up = true;
      } else if (event.offsetY > upperThreshold) {
        pressed.Down = true;
      }
      for (const name of ['Left', 'Right', 'Up', 'Down']) {
        if (pressed[name]) {
          this.buttonPress(name);
        } else {
          this.buttonUnpress(name);
        }
      }
    }
    const clearDpad = () => {
      for (const name of ['Up', 'Down', 'Left', 'Right'])
        this.buttonUnpress(name);
    }*/
    this.appendChild(buttonContainer);
  }
}

customElements.define('mgba-game', MgbaGame);
