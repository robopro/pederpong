import { createCustomEvent, CustomEventType, isPlayerFormChangeEvent } from "../types";
import { defaultPlayers } from "../variables";
import { PlayerForm } from "./PlayerForm";

export class GameSettings extends HTMLElement {
  #formsContainerElement: HTMLDivElement;
  #data: PlayerForm[] = [];
  #select: HTMLSelectElement;

  constructor() {
    super();

    // Initialize properties
    this.#data = [];

    // Binding methods
    this.setPlayers = this.setPlayers.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.onPlayerFormChange = this.onPlayerFormChange.bind(this);

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // Build HTML
    const playerSettingsContainer = document.createElement("div");
    shadow.appendChild(playerSettingsContainer);
    playerSettingsContainer.classList.add("player-settings");
    playerSettingsContainer.innerHTML = `
      <style>
        .player-settings {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
      </style>
      <label>How many players?</label>
      <select class="player-count">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2" selected>2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <div class="player-forms-container" style="
        display: flex;
        gap: 10px;
      "></div>
    `;

    // Initialize remaining properties
    const select = this.shadowRoot?.querySelector(".player-count");
    const playerFormsContainer = this.shadowRoot?.querySelector(".player-forms-container");

    if (select instanceof HTMLSelectElement && playerFormsContainer instanceof HTMLDivElement) {
      this.#select = select;
      this.#formsContainerElement = playerFormsContainer;
    } else {
      throw new Error(
        "PlayerSettings ~ constructor: Couldn't find select element or forms container element",
      );
    }

    // Add default PlayerForm
    this.addPlayer(2);
  }

  connectedCallback() {
    this.#select.addEventListener("change", this.setPlayers);

    this.#data.forEach((playerForm) => {
      playerForm.addEventListener("playerFormChange", (event) => this.onPlayerFormChange(event));
    });
  }

  disconnectedCallback() {
    this.removePlayer(this.data.length);
    this.#select.removeEventListener("change", this.setPlayers);
  }

  setPlayers(event: Event) {
    if (event.currentTarget instanceof HTMLSelectElement) {
      const newPlayerCount = parseInt(event.currentTarget.value);

      if (!isNaN(newPlayerCount)) {
        const currentPlayerCount = this.data.length;

        if (newPlayerCount > currentPlayerCount) {
          this.addPlayer(newPlayerCount - currentPlayerCount);
        } else {
          this.removePlayer(currentPlayerCount - newPlayerCount);
        }
        return;
      }
      throw new Error("PlayerSettings ~ setPlayers: event.currentTarget.value is not a number");
    }
    throw new Error(
      "PlayerSettings ~ setPlayers: event.currentTarget is not an instance of HTMLSelectElement",
    );
  }

  addPlayer(amount: number) {
    if (amount > 0) {
      let currentLastId = parseInt(this.data[this.data.length - 1]?.id);
      const newData = [...this.data];

      for (let i = 0; i < amount; i++) {
        const playerForm = document.createElement("player-form");

        if (playerForm instanceof PlayerForm) {
          currentLastId = isNaN(currentLastId) ? i : currentLastId + 1;
          const player = defaultPlayers[currentLastId];
          const { name, color, sound, keyup: keyUp, keydown: keyDown } = player;

          playerForm.setAttribute("id", currentLastId.toLocaleString());
          playerForm.setAttribute("name", name);
          playerForm.setAttribute("color", color);
          playerForm.setAttribute("sound", sound);
          playerForm.setAttribute("keyup", keyUp);
          playerForm.setAttribute("keydown", keyDown);
          playerForm.addEventListener(CustomEventType.PlayerFormChange, this.onPlayerFormChange);
          this.#formsContainerElement.appendChild(playerForm);

          newData.push(playerForm);
        } else {
          throw new Error(
            "PlayerSettings ~ addPlayer: playerForm is not an instance of PlayerForm",
          );
        }
      }
      this.data = newData;
    }
  }

  removePlayer(amount: number) {
    if (amount > 0) {
      const newData = this.data.slice(0, -amount);
      const formsToRemove = this.#data.splice(-amount);
      formsToRemove.forEach((playerForm) => {
        playerForm.removeEventListener(CustomEventType.PlayerFormChange, this.onPlayerFormChange);
        playerForm.remove();
      });
      this.data = newData;
    }
  }

  onPlayerFormChange(event: Event) {
    if (isPlayerFormChangeEvent(event)) {
      // TODO Why is this needed?
      event.stopImmediatePropagation();
      const changes = event.detail;
      const newData = [...this.data];
      const playerData = newData.find((playerData) => playerData.id === changes.previousId);

      if (!playerData) {
        newData.push(changes);
      }
      this.data = newData;
    }
  }

  get data() {
    return this.#data;
  }

  set data(data) {
    this.#data = data;
    this.dispatchEvent(createCustomEvent(CustomEventType.GameSettingsChange, this.data));
  }
}

customElements.define("game-settings", GameSettings);
