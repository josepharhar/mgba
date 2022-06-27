export default class MgbaSettings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    const button = document.createElement('button');
    button.textContent = 'settings';
    button.style = `
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
    `;
    this.shadowRoot.appendChild(button);

    button.onclick = () => {
      this.shadowRoot.appendChild(document.createElement('mgba-settings-dialog'));
    };
  }
};

customElements.define('mgba-settings', MgbaSettings);

class MgbaSettingsDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    container.style = `
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 75vw;
      height: 75vh;
      border: 1px solid black;
      background-color: white;
      padding: 15px;
    `;
    this.shadowRoot.appendChild(container);

    const title = document.createElement('h1');
    title.textContent = 'Settings';
    title.style = `
      text-align: center;
    `;
    container.appendChild(title);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'close settings';
    closeButton.onclick = () => this.remove();
    container.appendChild(closeButton);
  }
};

customElements.define('mgba-settings-dialog', MgbaSettingsDialog);
