import { PlayerScoreboard } from "./PlayerScoreboard";

export class ScoreboardContainer extends HTMLElement {
  #scoresContainer: HTMLDivElement;

  constructor() {
    super();

    // Build HTML
    const containerElement = document.createElement("div");
    containerElement.classList.add("scoreboard");
    containerElement.innerHTML = `
      <style>
        h2 {
          color: hotpink;
          font-size: xx-large;
          margin: 0;
        }
        .scoreboard {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .scores {
          display: flex;
          gap: 10px;
        }
      </style>
      <h2>Scores</h2>
    `;

    const scoresElement = document.createElement("div");
    scoresElement.classList.add("scores");
    containerElement.appendChild(scoresElement);
    this.#scoresContainer = scoresElement;

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(containerElement);
  }

  addPlayerScoreboard = (playerScoreboard: PlayerScoreboard) => {
    this.#scoresContainer.appendChild(playerScoreboard);
  };

  removePlayerScoreboards = () => {
    this.#scoresContainer.innerHTML = "";
  };

  get scoresContainer() {
    return this.#scoresContainer;
  }
}

customElements.define("scoreboard-container", ScoreboardContainer);
