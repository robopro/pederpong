import { createCustomEvent, CustomEventType } from "../types";

export class KeybindForm extends HTMLElement {
  #labelElement: HTMLLabelElement;
  #buttonElement: HTMLInputElement;
  #dialogElement: HTMLDialogElement;

  value: string = "";
  title: string = "";
  name: string = "";
  static observedAttributes = ["value", "title", "name"];

  constructor() {
    super();

    // Binding methods
    this.showDialog = this.showDialog.bind(this);
    this.onAttributeChanged = this.onAttributeChanged.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.changeKey = this.changeKey.bind(this);

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // Build HTML
    const playerForm = document.createElement("form");
    shadow.appendChild(playerForm);
    playerForm.classList.add("keybind-form");

    playerForm.innerHTML = `
      <style>
        dialog {
          background-color: #e9e9ed;
          border: none;
        }
        
        dialog:focus-visible {
          border: 1px solid hotpink;
        }
      </style>
      <label>${this.title}</label>
      <input class="keybind" name="keybind" type="button" value="${this.value}" >
      <dialog class="keybind-dialog">
        <p>Press a key, or ESC to cancel</p>
      </dialog>
    `;

    // Initialize remaining properties
    const labelElement = this.shadowRoot?.querySelector("label");
    const buttonElement = this.shadowRoot?.querySelector(".keybind");
    const dialogElement = this.shadowRoot?.querySelector(".keybind-dialog");

    if (
      labelElement instanceof HTMLLabelElement &&
      buttonElement instanceof HTMLInputElement &&
      dialogElement instanceof HTMLDialogElement
    ) {
      this.#labelElement = labelElement;
      this.#buttonElement = buttonElement;
      this.#dialogElement = dialogElement;
    } else {
      throw new Error("PlayerForm ~ constructor: Couldn't find internal elements");
    }
  }

  connectedCallback() {
    this.#buttonElement.addEventListener("click", this.showDialog);
  }

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.showDialog);
    this.#dialogElement.removeEventListener("keyup", this.onKeyUp);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (newValue !== oldValue) {
      this.onAttributeChanged(name, newValue);
    }
  }

  showDialog() {
    this.#dialogElement.addEventListener("keyup", this.onKeyUp);
    this.#dialogElement.showModal();
  }

  onAttributeChanged(name: string, value: string) {
    switch (name) {
      case "title":
        this.title = value;
        this.#labelElement.innerHTML = value;
        break;
      case "name":
        this.name = value;
        break;
      case "value":
        this.changeKey(value);
        break;
      default:
        break;
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (this.#dialogElement.open) {
      this.changeKey(event.key);
    }
  }

  changeKey(key: string) {
    if (key !== "Esc" && key !== "Escape") {
      this.value = key;
      this.#buttonElement.value = key;
      this.dispatchEvent(createCustomEvent(CustomEventType.KeybindChange, key));
    }
    this.#dialogElement.removeEventListener("keyup", this.onKeyUp);
    this.#dialogElement.close();
  }
}

customElements.define("keybind-form", KeybindForm);
