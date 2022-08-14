import * as FileLoader from './fileloader.js';

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
    console.log('buttonPress ' + name);
  }

  buttonUnpress(name) {
    console.log('buttonUnpress ' + name);
  }

  addButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    for (const name of ['B', 'A', 'Start', 'Select']) {
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
      const x = event.offsetX / dpad.offsetWidth;
      const y = event.offsetY / dpad.offsetHeight;
      const threshold = 0.25;
      const pressed = {
        Left: false,
        Right: false,
        Up: false,
        Down: false,
      }
      if (x < threshold) {
        pressed.Left = true;
      } else if (x > 1 - threshold) {
        pressed.Right = true;
      }
      if (y < threshold) {
        pressed.Up = true;
      } else if (y > 1 - threshold) {
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
