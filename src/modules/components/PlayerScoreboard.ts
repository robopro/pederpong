interface PlayerScoreboardData {
  playerId: string;
  name: string;
  score: string;
  color: string;
}

export class PlayerScoreboard extends HTMLElement {
  #containerElement: HTMLDivElement;
  #nameElement: HTMLParagraphElement;
  #scoreElement: HTMLParagraphElement;

  playerid = "";
  name = "";
  score = "";
  color = "";
  static observedAttributes = ["playerid", "name", "score", "color"];

  constructor({ playerId, name, score, color }: PlayerScoreboardData) {
    super();

    this.playerid = playerId;
    this.name = name;
    this.score = score;
    this.color = color;

    // Build HTML
    const containerElement = document.createElement("div");
    this.#containerElement = containerElement;
    containerElement.classList.add("player-score");
    containerElement.style.setProperty("--player-color", this.color);
    containerElement.innerHTML = `
      <style>
        .player-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation-name: color-swap;
          animation-iteration-count: infinite;
          animation-duration: 150ms;
          animation-timing-function: ease-in;

          p {
            margin: 0;
          }
        }
        .player-name {
          font-weight: bold;
        }

        @keyframes color-swap {
          from { color: var(--player-color, black)};
          to { color: transparent};
        }
      </style>
    `;

    const nameElement = document.createElement("p");
    this.#nameElement = nameElement;
    nameElement.classList.add("player-name");
    nameElement.innerHTML = this.name;
    containerElement.appendChild(nameElement);

    const scoreElement = document.createElement("p");
    this.#scoreElement = scoreElement;
    scoreElement.innerHTML = this.score;
    containerElement.appendChild(scoreElement);

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(containerElement);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (newValue !== oldValue) {
      switch (name) {
        case "playerid":
          this.playerid = newValue;
          break;
        case "name":
          this.name = newValue;
          this.#nameElement.innerHTML = newValue;
          break;
        case "score":
          this.score = newValue;
          this.#scoreElement.innerHTML = newValue;
          break;
        case "color":
          this.color = newValue;
          this.#containerElement.style.setProperty("--player-color", newValue);
          break;
      }
    }
  }

  setPlayerScoreboardData = ({ playerId, name, score, color }: Partial<PlayerScoreboardData>) => {
    if (playerId) {
      this.playerid = playerId;
    }
    if (name) {
      this.name = name;
      this.#nameElement.innerHTML = name;
    }
    if (score) {
      this.score = score;
      this.#scoreElement.innerHTML = score;
    }
    if (color) {
      this.color = color;
      this.#containerElement.style.setProperty("--player-color", color);
    }
  };
}

customElements.define("player-scoreboard", PlayerScoreboard);
