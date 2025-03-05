import { swapColorAnimation, swapColorKeyframes } from "../variables";

export class PlayerScore extends HTMLElement {
  #containerElement: HTMLDivElement;
  #nameElement: HTMLParagraphElement;
  #scoreElement: HTMLParagraphElement;

  id: string = "";
  name: string = "";
  score: string = "";
  color: string = "";
  static observedAttributes = ["id", "name", "score", "color"];

  constructor() {
    super();

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
          ${swapColorAnimation}

          p {
            margin: 0;
          }
        }
        .player-name {
          font-weight: bold;
        }

        ${swapColorKeyframes}
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
        case "id":
          this.id = newValue;
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
        default:
          break;
      }
    }
  }
}

customElements.define("player-score", PlayerScore);
