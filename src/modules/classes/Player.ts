import { Color, PlayerFormData, Sound } from "../types";
import { baseAudioUrl } from "../utils";

export class Player {
  static #currentId: number = 0;
  static generateId() {
    this.#currentId += 1;
    return this.#currentId;
  }

  #audioElement: HTMLAudioElement;
  #id: number;
  #score = 0;
  #name: string;
  #color: Color;
  #sound: Sound;
  #keyUp: string | undefined;
  #keyDown: string | undefined;
  canWin = true;

  constructor({ name, color, sound, keyup, keydown }: PlayerFormData) {
    this.#id = Player.generateId();
    this.#name = name;
    this.#color = color;
    this.#sound = sound;
    this.#keyUp = keyup;
    this.#keyDown = keydown;
    this.#audioElement = new Audio(`${baseAudioUrl}${this.#sound}`);
  }

  playAudio = () => {
    this.#audioElement.play();
  };

  getColor = () => {
    return Math.random() < 0.5 ? this.#color : "transparent";
  };

  addScore = (amount: number) => {
    this.#score += amount;
  };

  reset = () => {
    this.#score = 0;
  };

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }

  get score() {
    return this.#score;
  }

  get keys() {
    return { keyUp: this.#keyUp, keyDown: this.#keyDown };
  }
}
