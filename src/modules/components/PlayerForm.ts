import {
  Color,
  createCustomEvent,
  CustomEventType,
  isColor,
  isSound,
  PlayerFormData,
  Sound,
} from "../types";
import { defaultPlayerFormData } from "../utils";
import { KeybindForm } from "./KeybindForm";

export class PlayerForm extends HTMLElement {
  #nameInput: HTMLInputElement;
  #colorInput: HTMLSelectElement;
  #soundInput: HTMLSelectElement;
  #keyUpInput: KeybindForm;
  #keyDownInput: KeybindForm;

  name: string;
  color: Color;
  sound: Sound;
  keyup: string;
  keydown: string;
  static observedAttributes = ["name", "color", "sound", "keyup", "keydown"];

  constructor(defaultPlayerIndex: number = 0) {
    super();

    // Initialize properties
    const { name, color, sound, keyup, keydown } =
      defaultPlayerFormData[defaultPlayerIndex] ?? defaultPlayerFormData[0];
    this.name = name;
    this.color = color;
    this.sound = sound;
    this.keyup = keyup;
    this.keydown = keydown;

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // Build HTML
    const playerForm = document.createElement("form");
    shadow.appendChild(playerForm);
    playerForm.classList.add("player-form");

    const colorOptions = Object.values(Color)
      .map((color) => `<option value=${color}>${color}</option>`)
      .join();

    const soundOptions = Object.values(Sound)
      .map((sound) => `<option value=${sound}>${sound.split(".mp3").shift()}</option>`)
      .join();

    playerForm.innerHTML = `
      <style>
        .player-form {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        select,
        option {
          text-transform: capitalize;
        }
      </style>
      <label>Player name</label>
      <input class="player-name" name="name" placeholder="Enter name" value="${this.name}" style="background-color: #e9e9ed;">
      <label>Player color</label>
      <select class="player-color" name="color" value="${this.color}">
        ${colorOptions}
      </select>
      <label>Player sound</label>
      <select class="player-sound" name="sound" value="${this.sound}">
        ${soundOptions}
      </select>
      <label>Inputs</label>
      <div class="keybinds" style="display: flex; gap: 10px;">
        <keybind-form class="player-keyup" name="keyup"></keybind-form>
        <keybind-form class="player-keydown" name="keydown"></keybind-form>
      </div>
    `;

    // Initialize remaining properties
    const nameElement = this.shadowRoot?.querySelector(".player-name");
    const colorElement = this.shadowRoot?.querySelector(".player-color");
    const soundElement = this.shadowRoot?.querySelector(".player-sound");
    const keyUpElement = this.shadowRoot?.querySelector(".player-keyup");
    const keyDownElement = this.shadowRoot?.querySelector(".player-keydown");

    if (
      nameElement instanceof HTMLInputElement &&
      colorElement instanceof HTMLSelectElement &&
      soundElement instanceof HTMLSelectElement &&
      keyUpElement instanceof KeybindForm &&
      keyDownElement instanceof KeybindForm
    ) {
      this.#nameInput = nameElement;
      this.#colorInput = colorElement;
      this.#soundInput = soundElement;

      this.#keyUpInput = keyUpElement;
      this.#keyUpInput.setAttribute("value", this.keyup);

      this.#keyDownInput = keyDownElement;
      this.#keyDownInput.setAttribute("value", this.keydown);
    } else {
      throw new Error("PlayerForm ~ constructor: Couldn't find internal elements");
    }
  }

  connectedCallback() {
    this.#nameInput.addEventListener("change", this.onFormChange);
    this.#colorInput.addEventListener("change", this.onFormChange);
    this.#soundInput.addEventListener("change", this.onFormChange);
    this.#keyUpInput.addEventListener(CustomEventType.KeybindChange, this.onFormChange);
    this.#keyDownInput.addEventListener(CustomEventType.KeybindChange, this.onFormChange);
  }

  disconnectedCallback() {
    this.#nameInput.removeEventListener("change", this.onFormChange);
    this.#colorInput.removeEventListener("change", this.onFormChange);
    this.#soundInput.removeEventListener("change", this.onFormChange);
    this.#keyUpInput.removeEventListener(CustomEventType.KeybindChange, this.onFormChange);
    this.#keyDownInput.removeEventListener(CustomEventType.KeybindChange, this.onFormChange);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (newValue !== oldValue) {
      this.handleChange(name, newValue);
    }
  }

  private onFormChange = (event: Event) => {
    const { currentTarget } = event;
    if (
      currentTarget instanceof HTMLSelectElement ||
      currentTarget instanceof HTMLInputElement ||
      currentTarget instanceof KeybindForm
    ) {
      const { name, value } = currentTarget;
      this.handleChange(name, value);
    }
  };

  private handleChange = (name: string, value: string) => {
    switch (name) {
      case "name":
        this.name = value;
        this.#nameInput.value = value;
        break;
      case "color":
        if (isColor(value)) {
          this.color = value;
          this.#colorInput.value = value;
        }
        break;
      case "sound":
        if (isSound(value)) {
          this.sound = value;
          this.#soundInput.value = value;
        }
        break;
      case "keyup":
        this.keyup = value;
        this.#keyUpInput.setAttribute("value", value);
        break;
      case "keydown":
        this.keydown = value;
        this.#keyDownInput.setAttribute("value", value);
        break;
    }
    this.dispatchEvent(createCustomEvent(CustomEventType.PlayerFormChange, null));
  };

  getFormData = (): PlayerFormData => {
    return {
      name: this.name,
      color: this.color,
      sound: this.sound,
      keyup: this.keyup,
      keydown: this.keydown,
    };
  };

  setFormData = ({ name, color, sound, keyup, keydown }: Required<PlayerFormData>) => {
    this.name = name;
    this.#nameInput.value = name;
    this.color = color;
    this.#colorInput.value = color;
    this.sound = sound;
    this.#soundInput.value = sound;
    this.keyup = keyup;
    this.#keyUpInput.setAttribute("value", keyup);
    this.keydown = keydown;
    this.#keyDownInput.setAttribute("value", keydown);
  };
}

customElements.define("player-form", PlayerForm);
