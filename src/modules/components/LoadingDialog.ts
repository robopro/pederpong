export class LoadingDialog extends HTMLElement {
  #dialogElement: HTMLDialogElement;

  constructor() {
    super();

    // Build HTML
    const dialogElement = document.createElement("dialog");
    dialogElement.classList.add("loading-dialog");

    dialogElement.innerHTML = `
      <style>
        .loading-dialog {
          background-color: #e9e9ed;
          border: none;
          width: 200px;
        }

        .loading-dialog-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;  
          
          p {
            margin: 0;
          }
        }

        .loading-dialog:focus-visible {
          outline: 2px solid hotpink;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 5px solid cyan;
          border-bottom-color: hotpink;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      </style>
      <div class="loading-dialog-body">
        <div class="spinner"></div>
        <p>Loading</p>
      </div>
    `;
    this.#dialogElement = dialogElement;

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(dialogElement);
  }

  show = () => {
    this.#dialogElement.showModal();
  };

  close = () => {
    this.#dialogElement.close();
  };
}

customElements.define("loading-dialog", LoadingDialog);
