import { createCustomEvent, CustomEventType, isPlayerFormChangeEvent } from "../types";
import { PlayerForm } from "./PlayerForm";

export class GameSettings extends HTMLElement {
  #playerFormsContainer: HTMLDivElement;
  #playerForms: PlayerForm[] = [];
  #playerCountInput: HTMLSelectElement;

  constructor() {
    super();

    // Initialize properties
    this.#playerForms = [];

    // Build HTML
    const playerSettingsContainer = document.createElement("div");

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
        <option value="5">5</option>
      </select>
      <div class="player-forms-container" style="
        display: flex;
        gap: 10px;
      "></div>
    `;

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(playerSettingsContainer);

    // Initialize remaining properties
    const playerCountInput = this.shadowRoot?.querySelector(".player-count");
    const playerFormsContainer = this.shadowRoot?.querySelector(".player-forms-container");

    if (
      playerCountInput instanceof HTMLSelectElement &&
      playerFormsContainer instanceof HTMLDivElement
    ) {
      this.#playerCountInput = playerCountInput;
      this.#playerFormsContainer = playerFormsContainer;
    } else {
      throw new Error(
        "PlayerSettings ~ constructor: Couldn't find select element or forms container element",
      );
    }

    // Add default PlayerForm
    this.addPlayerForms(2);
  }

  connectedCallback() {
    this.#playerCountInput.addEventListener("change", this.setPlayerForms);
  }

  disconnectedCallback() {
    this.removePlayerForms(this.#playerForms.length);
    this.#playerCountInput.removeEventListener("change", this.setPlayerForms);
  }

  private setPlayerForms = (event: Event) => {
    if (event.currentTarget instanceof HTMLSelectElement) {
      const newPlayerCount = parseInt(event.currentTarget.value);

      if (!isNaN(newPlayerCount)) {
        const currentPlayerCount = this.#playerForms.length;

        if (newPlayerCount > currentPlayerCount) {
          this.addPlayerForms(newPlayerCount - currentPlayerCount);
        } else {
          this.removePlayerForms(currentPlayerCount - newPlayerCount);
        }
        return;
      }
      throw new Error("PlayerSettings ~ setPlayers: event.currentTarget.value is not a number");
    }
    throw new Error(
      "PlayerSettings ~ setPlayers: event.currentTarget is not an instance of HTMLSelectElement",
    );
  };

  private addPlayerForms = (amount: number) => {
    if (amount > 0) {
      const newPlayerForms = [...this.#playerForms];

      for (let i = 0; i < amount; i++) {
        const playerFormIndex = this.#playerForms.length + i;
        const playerForm = new PlayerForm(playerFormIndex);
        playerForm.addEventListener(CustomEventType.PlayerFormChange, this.onPlayerFormChange);
        this.#playerFormsContainer.appendChild(playerForm);
        newPlayerForms.push(playerForm);
      }
      this.playerForms = newPlayerForms;
    }
  };

  private removePlayerForms = (amount: number) => {
    if (amount > 0) {
      const newPlayerForms = this.#playerForms.slice(0, -amount);
      const formsToRemove = this.#playerForms.splice(-amount);
      formsToRemove.forEach((playerForm) => {
        playerForm.removeEventListener(CustomEventType.PlayerFormChange, this.onPlayerFormChange);
        playerForm.remove();
      });
      this.playerForms = newPlayerForms;
    }
  };

  private onPlayerFormChange = (event: Event) => {
    if (isPlayerFormChangeEvent(event)) {
      // TODO Why is this needed?
      event.stopImmediatePropagation();
      this.dispatchEvent(createCustomEvent(CustomEventType.GameSettingsChange, null));
    }
  };

  get playerForms() {
    return this.#playerForms;
  }

  set playerForms(playerForms) {
    this.#playerForms = playerForms;
    this.dispatchEvent(createCustomEvent(CustomEventType.GameSettingsChange, null));
  }
}

customElements.define("game-settings", GameSettings);
