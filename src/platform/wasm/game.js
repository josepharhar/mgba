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

  addButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    for (const name of ['B', 'A', 'Select', 'Start']) {
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
    for (const name of ['Up', 'Down', 'Left', 'Right']) {
      /*keyManager.listen(name, pressed => {
        dpad.classList.toggle(name, pressed);
      });*/
    }
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
    }
    this.appendChild(buttonContainer);
  }
}

customElements.define('mgba-game', MgbaGame);
