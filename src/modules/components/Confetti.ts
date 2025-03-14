import { confettiColors, getRandomInt, getRandomNumber } from "../utils";

export class Confetti extends HTMLElement {
  #confettiContainer: HTMLDivElement;

  constructor() {
    super();

    // Build HTML
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    const style = document.createElement("style");
    confetti.appendChild(style);
    style.innerHTML = `
      .confetti-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; /* Prevent interaction */
        overflow: hidden;
      }

      .confetti-piece {
        position: absolute;
        opacity: 0.9;
        animation: confetti-fall var(--fall-duration, 4s) linear forwards;
      }

      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotate(var(--rotation-start, 0deg));
          opacity: 1;
        }
        100% {
          transform: translateY(99vh) rotate(var(--rotation-end, 360deg));
          opacity: 0.8;
        }
      }
    `;

    const confettiContainer = document.createElement("div");
    confetti.appendChild(confettiContainer);
    confettiContainer.classList.add("confetti-container");
    this.#confettiContainer = confettiContainer;

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(confetti);
  }

  start = () => {
    for (let i = 0; i < 150; i++) {
      this.createConfettiPiece();
    }
  };

  stop = () => {
    this.#confettiContainer.innerHTML = "";
  };

  private createConfettiPiece = () => {
    const confettiPiece = document.createElement("div");
    confettiPiece.classList.add("confetti-piece");
    confettiPiece.style.left = `${Math.random() * 100}%`;
    confettiPiece.style.width = `${getRandomInt(5, 10)}px`;
    confettiPiece.style.height = `${getRandomInt(2, 5)}px`;
    confettiPiece.style.background = this.getConfettiColor();
    confettiPiece.style.setProperty("--fall-duration", `${getRandomNumber(3, 6)}s`);
    confettiPiece.style.setProperty("--rotation-start", `${getRandomInt(0, 90)}deg`);
    confettiPiece.style.setProperty("--rotation-end", `${getRandomInt(270, 360)}deg`);

    this.#confettiContainer.appendChild(confettiPiece);
  };

  private getConfettiColor = () => {
    const index = Math.floor(Math.random() * confettiColors.length);
    return confettiColors[index] ?? confettiColors[0];
  };
}

customElements.define("confetti-tag", Confetti);
