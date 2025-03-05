import { PlayerForm } from "./PlayerForm";
import { PlayerScore } from "./PlayerScore";

export class Scoreboard extends HTMLElement {
  #scoresElement: HTMLDivElement;

  constructor() {
    super();

    // Binding methods
    this.setScores = this.setScores.bind(this);

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
    this.#scoresElement = scoresElement;

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(containerElement);
  }

  setScores(players: PlayerForm[]) {
    this.#scoresElement.innerHTML = "";

    for (const player of players) {
      this.createPlayerScore(player);
    }
  }

  createPlayerScore(player: PlayerForm) {
    const playerScore = document.createElement("player-score");
    if (playerScore instanceof PlayerScore) {
      playerScore.setAttribute("id", player.id);
      playerScore.setAttribute("name", player.name);
      playerScore.setAttribute("score", player.score);
      playerScore.setAttribute("color", player.color);
      this.#scoresElement.appendChild(playerScore);
    }
    return;
  }
}

customElements.define("score-board", Scoreboard);
