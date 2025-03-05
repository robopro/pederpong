import { Color, createCustomEvent, CustomEventType, Sound } from "../types";
import { defaultPlayers } from "../variables";
import { KeybindForm } from "./KeybindForm";

export interface Player {
  id: string;
  name: string;
  color: string;
  sound: string;
  keyup: string;
  keydown: string;
}

export class PlayerForm extends HTMLElement {
  #previousId: string | undefined;
  #nameElement: HTMLInputElement;
  #colorElement: HTMLSelectElement;
  #soundElement: HTMLSelectElement;
  #keyUpElement: KeybindForm;
  #keyDownElement: KeybindForm;
  #audioElement: HTMLAudioElement;

  name: string;
  color: string;
  sound: string;
  keyup: string;
  keydown: string;
  score: string = "0";
  static observedAttributes = ["id", "name", "color", "sound", "keyup", "keydown", "score"];

  constructor() {
    super();

    // Initialize properties
    const { name, color, sound, keyup, keydown } = defaultPlayers[0];
    this.name = name;
    this.color = color;
    this.sound = sound;
    this.keyup = keyup;
    this.keydown = keydown;
    this.#audioElement = new Audio(`./src/sounds/${this.sound}.mp3`);

    // Binding methods
    this.onFormChange = this.onFormChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);

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
      .map((sound) => `<option value=${sound}>${sound}</option>`)
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
      this.#nameElement = nameElement;
      this.#colorElement = colorElement;
      this.#soundElement = soundElement;

      this.#keyUpElement = keyUpElement;
      this.#keyUpElement.setAttribute("value", this.keyup);

      this.#keyDownElement = keyDownElement;
      this.#keyDownElement.setAttribute("value", this.keydown);
    } else {
      throw new Error("PlayerForm ~ constructor: Couldn't find internal elements");
    }
  }

  connectedCallback() {
    this.#nameElement.addEventListener("change", this.onFormChange);
    this.#colorElement.addEventListener("change", this.onFormChange);
    this.#soundElement.addEventListener("change", this.onFormChange);
    this.#keyUpElement.addEventListener(CustomEventType.KeybindChange, this.onFormChange);
    this.#keyDownElement.addEventListener(CustomEventType.KeybindChange, this.onFormChange);
  }

  disconnectedCallback() {
    this.#nameElement.removeEventListener("change", this.onFormChange);
    this.#colorElement.removeEventListener("change", this.onFormChange);
    this.#soundElement.removeEventListener("change", this.onFormChange);
    this.#keyUpElement.removeEventListener(CustomEventType.KeybindChange, this.onFormChange);
    this.#keyDownElement.removeEventListener(CustomEventType.KeybindChange, this.onFormChange);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (newValue !== oldValue) {
      this.handleFormChange(name, newValue);
    }
  }

  onFormChange(event: Event) {
    const { currentTarget } = event;

    if (
      currentTarget instanceof HTMLSelectElement ||
      currentTarget instanceof HTMLInputElement ||
      currentTarget instanceof KeybindForm
    ) {
      const { name, value } = currentTarget;
      this.handleFormChange(name, value);
    }
  }

  handleFormChange(name: string, value: string) {
    this.#previousId = this.id;
    switch (name) {
      case "id":
        this.id = value;
        break;
      case "name":
        this.name = value;
        this.#nameElement.value = value;
        break;
      case "color":
        this.color = value;
        this.#colorElement.value = value;
        break;
      case "sound":
        this.sound = value;
        this.#soundElement.value = value;
        this.#audioElement = new Audio(`./src/sounds/${this.sound}.mp3`);
        break;
      case "keyup":
        this.keyup = value;
        this.#keyUpElement.setAttribute("value", value);
        break;
      case "keydown":
        this.keydown = value;
        this.#keyDownElement.setAttribute("value", value);
        break;
      case "score":
        this.score = value;
      default:
        break;
    }
    this.dispatchEvent(createCustomEvent(CustomEventType.PlayerFormChange, this));
  }

  getColor() {
    return Math.random() < 0.5 ? this.color : "black";
  }

  play() {
    this.#audioElement.play();
  }

  get previousId() {
    return this.#previousId;
  }
}

customElements.define("player-form", PlayerForm);
