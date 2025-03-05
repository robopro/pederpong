"use strict";
(() => {
  // src/modules/types.ts
  var createCustomEvent = (type, detail) => {
    return new CustomEvent(type, { detail });
  };
  var isGameSettingsChangeEvent = (obj) => obj instanceof CustomEvent && obj.type === "gameSettingsChange" /* GameSettingsChange */;
  var isPlayerFormChangeEvent = (obj) => obj instanceof CustomEvent && obj.type === "playerFormChange" /* PlayerFormChange */;
  var Color = /* @__PURE__ */ ((Color2) => {
    Color2["Blue"] = "blue";
    Color2["Green"] = "green";
    Color2["Red"] = "red";
    Color2["Yellow"] = "yellow";
    return Color2;
  })(Color || {});
  var Sound = /* @__PURE__ */ ((Sound2) => {
    Sound2["Eagle"] = "eagle";
    Sound2["Goat"] = "goat";
    Sound2["Monster"] = "monster";
    Sound2["TRex"] = "trex";
    return Sound2;
  })(Sound || {});

  // src/modules/components/KeybindForm.ts
  var KeybindForm = class extends HTMLElement {
    #labelElement;
    #buttonElement;
    #dialogElement;
    value = "";
    title = "";
    name = "";
    static observedAttributes = ["value", "title", "name"];
    constructor() {
      super();
      this.showDialog = this.showDialog.bind(this);
      this.onAttributeChanged = this.onAttributeChanged.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      this.changeKey = this.changeKey.bind(this);
      const shadow = this.attachShadow({ mode: "open" });
      const playerForm = document.createElement("form");
      shadow.appendChild(playerForm);
      playerForm.classList.add("keybind-form");
      playerForm.innerHTML = `
      <style>
        dialog {
          background-color: #e9e9ed;
          border: none;
        }
        
        dialog:focus-visible {
          border: 1px solid hotpink;
        }
      </style>
      <label>${this.title}</label>
      <input class="keybind" name="keybind" type="button" value="${this.value}" >
      <dialog class="keybind-dialog">
        <p>Press a key, or ESC to cancel</p>
      </dialog>
    `;
      const labelElement = this.shadowRoot?.querySelector("label");
      const buttonElement = this.shadowRoot?.querySelector(".keybind");
      const dialogElement = this.shadowRoot?.querySelector(".keybind-dialog");
      if (labelElement instanceof HTMLLabelElement && buttonElement instanceof HTMLInputElement && dialogElement instanceof HTMLDialogElement) {
        this.#labelElement = labelElement;
        this.#buttonElement = buttonElement;
        this.#dialogElement = dialogElement;
      } else {
        throw new Error("PlayerForm ~ constructor: Couldn't find internal elements");
      }
    }
    connectedCallback() {
      this.#buttonElement.addEventListener("click", this.showDialog);
    }
    disconnectedCallback() {
      this.#buttonElement.removeEventListener("click", this.showDialog);
      this.#dialogElement.removeEventListener("keyup", this.onKeyUp);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue !== oldValue) {
        this.onAttributeChanged(name, newValue);
      }
    }
    showDialog() {
      this.#dialogElement.addEventListener("keyup", this.onKeyUp);
      this.#dialogElement.showModal();
    }
    onAttributeChanged(name, value) {
      switch (name) {
        case "title":
          this.title = value;
          this.#labelElement.innerHTML = value;
          break;
        case "name":
          this.name = value;
          break;
        case "value":
          this.changeKey(value);
          break;
        default:
          break;
      }
    }
    onKeyUp(event) {
      if (this.#dialogElement.open) {
        this.changeKey(event.key);
      }
    }
    changeKey(key) {
      if (key !== "Esc" && key !== "Escape") {
        this.value = key;
        this.#buttonElement.value = key;
        this.dispatchEvent(createCustomEvent("keybindChange" /* KeybindChange */, key));
      }
      this.#dialogElement.removeEventListener("keyup", this.onKeyUp);
      this.#dialogElement.close();
    }
  };
  customElements.define("keybind-form", KeybindForm);

  // src/modules/components/PlayerForm.ts
  var PlayerForm = class extends HTMLElement {
    #previousId;
    #nameElement;
    #colorElement;
    #soundElement;
    #keyUpElement;
    #keyDownElement;
    #audioElement;
    name;
    color;
    sound;
    keyup;
    keydown;
    score = "0";
    static observedAttributes = ["id", "name", "color", "sound", "keyup", "keydown", "score"];
    constructor() {
      super();
      const { name, color, sound, keyup, keydown } = defaultPlayers[0];
      this.name = name;
      this.color = color;
      this.sound = sound;
      this.keyup = keyup;
      this.keydown = keydown;
      this.#audioElement = new Audio(`./src/sounds/${this.sound}.mp3`);
      this.onFormChange = this.onFormChange.bind(this);
      this.handleFormChange = this.handleFormChange.bind(this);
      const shadow = this.attachShadow({ mode: "open" });
      const playerForm = document.createElement("form");
      shadow.appendChild(playerForm);
      playerForm.classList.add("player-form");
      const colorOptions = Object.values(Color).map((color2) => `<option value=${color2}>${color2}</option>`).join();
      const soundOptions = Object.values(Sound).map((sound2) => `<option value=${sound2}>${sound2}</option>`).join();
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
      const nameElement = this.shadowRoot?.querySelector(".player-name");
      const colorElement = this.shadowRoot?.querySelector(".player-color");
      const soundElement = this.shadowRoot?.querySelector(".player-sound");
      const keyUpElement = this.shadowRoot?.querySelector(".player-keyup");
      const keyDownElement = this.shadowRoot?.querySelector(".player-keydown");
      if (nameElement instanceof HTMLInputElement && colorElement instanceof HTMLSelectElement && soundElement instanceof HTMLSelectElement && keyUpElement instanceof KeybindForm && keyDownElement instanceof KeybindForm) {
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
      this.#keyUpElement.addEventListener("keybindChange" /* KeybindChange */, this.onFormChange);
      this.#keyDownElement.addEventListener("keybindChange" /* KeybindChange */, this.onFormChange);
    }
    disconnectedCallback() {
      this.#nameElement.removeEventListener("change", this.onFormChange);
      this.#colorElement.removeEventListener("change", this.onFormChange);
      this.#soundElement.removeEventListener("change", this.onFormChange);
      this.#keyUpElement.removeEventListener("keybindChange" /* KeybindChange */, this.onFormChange);
      this.#keyDownElement.removeEventListener("keybindChange" /* KeybindChange */, this.onFormChange);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue !== oldValue) {
        this.handleFormChange(name, newValue);
      }
    }
    onFormChange(event) {
      const { currentTarget } = event;
      if (currentTarget instanceof HTMLSelectElement || currentTarget instanceof HTMLInputElement || currentTarget instanceof KeybindForm) {
        const { name, value } = currentTarget;
        this.handleFormChange(name, value);
      }
    }
    handleFormChange(name, value) {
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
      this.dispatchEvent(createCustomEvent("playerFormChange" /* PlayerFormChange */, this));
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
  };
  customElements.define("player-form", PlayerForm);

  // src/modules/variables.ts
  var maxPlayers = 4;
  var canvasDimension = 800;
  var gridSize = 20;
  var defaultPaddleLength = gridSize * 4;
  var defaultPaddleDepth = gridSize;
  var defaultPaddleSpeed = 7;
  var defaultBallSize = gridSize;
  var defaultBallSpeed = 2;
  var defaultBallPosition = canvasDimension / 2 - defaultBallSize / 2;
  var swapColorKeyframes = `
  @keyframes color-swap {
    from { color: var(--player-color, black)};
    to { color: transparent};
  }
`;
  var swapColorAnimation = `
  animation-name: color-swap;
  animation-iteration-count: infinite;
  animation-duration: 150ms;
  animation-timing-function: ease-in;
`;
  var defaultKeys = [
    ["w", "s"],
    ["r", "f"],
    ["y", "h"],
    ["i", "k"]
  ];
  var defaultPlayers = [
    {
      id: "0",
      name: "John",
      color: "blue" /* Blue */,
      sound: "eagle" /* Eagle */,
      keyup: defaultKeys[0][0],
      keydown: defaultKeys[0][1]
    },
    {
      id: "1",
      name: "Jane",
      color: "green" /* Green */,
      sound: "goat" /* Goat */,
      keyup: defaultKeys[1][0],
      keydown: defaultKeys[1][1]
    },
    {
      id: "2",
      name: "Jahn",
      color: "red" /* Red */,
      sound: "monster" /* Monster */,
      keyup: defaultKeys[2][0],
      keydown: defaultKeys[2][1]
    },
    {
      id: "3",
      name: "Jone",
      color: "yellow" /* Yellow */,
      sound: "trex" /* TRex */,
      keyup: defaultKeys[3][0],
      keydown: defaultKeys[3][1]
    }
  ];
  var createDefaultPlayer = (index) => {
    const player = defaultPlayers[index];
    const playerForm = new PlayerForm();
    playerForm.id = player.id;
    playerForm.name = player.name;
    playerForm.color = player.color;
    playerForm.sound = player.sound;
    playerForm.keyup = player.keyup;
    playerForm.keydown = player.keydown;
    return playerForm;
  };
  var getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  var getRandomInt = (min, max) => {
    return Math.floor(getRandomNumber(min, max));
  };

  // src/modules/components/GameSettings.ts
  var GameSettings = class extends HTMLElement {
    #formsContainerElement;
    #data = [];
    #select;
    constructor() {
      super();
      this.#data = [];
      this.setPlayers = this.setPlayers.bind(this);
      this.addPlayer = this.addPlayer.bind(this);
      this.removePlayer = this.removePlayer.bind(this);
      this.onPlayerFormChange = this.onPlayerFormChange.bind(this);
      const shadow = this.attachShadow({ mode: "open" });
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
      const select = this.shadowRoot?.querySelector(".player-count");
      const playerFormsContainer = this.shadowRoot?.querySelector(".player-forms-container");
      if (select instanceof HTMLSelectElement && playerFormsContainer instanceof HTMLDivElement) {
        this.#select = select;
        this.#formsContainerElement = playerFormsContainer;
      } else {
        throw new Error(
          "PlayerSettings ~ constructor: Couldn't find select element or forms container element"
        );
      }
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
    setPlayers(event) {
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
        "PlayerSettings ~ setPlayers: event.currentTarget is not an instance of HTMLSelectElement"
      );
    }
    addPlayer(amount) {
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
            playerForm.addEventListener("playerFormChange" /* PlayerFormChange */, this.onPlayerFormChange);
            this.#formsContainerElement.appendChild(playerForm);
            newData.push(playerForm);
          } else {
            throw new Error(
              "PlayerSettings ~ addPlayer: playerForm is not an instance of PlayerForm"
            );
          }
        }
        this.data = newData;
      }
    }
    removePlayer(amount) {
      if (amount > 0) {
        const newData = this.data.slice(0, -amount);
        const formsToRemove = this.#data.splice(-amount);
        formsToRemove.forEach((playerForm) => {
          playerForm.removeEventListener("playerFormChange" /* PlayerFormChange */, this.onPlayerFormChange);
          playerForm.remove();
        });
        this.data = newData;
      }
    }
    onPlayerFormChange(event) {
      if (isPlayerFormChangeEvent(event)) {
        event.stopImmediatePropagation();
        const changes = event.detail;
        const newData = [...this.data];
        const playerData = newData.find((playerData2) => playerData2.id === changes.previousId);
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
      this.dispatchEvent(createCustomEvent("gameSettingsChange" /* GameSettingsChange */, this.data));
    }
  };
  customElements.define("game-settings", GameSettings);

  // src/modules/components/Confetti.ts
  var Confetti = class extends HTMLElement {
    #confettiContainer;
    constructor() {
      super();
      this.start = this.start.bind(this);
      this.stop = this.stop.bind(this);
      this.createConfettiPiece = this.createConfettiPiece.bind(this);
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
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(confetti);
    }
    start() {
      for (let i = 0; i < 150; i++) {
        this.createConfettiPiece();
      }
    }
    stop() {
      this.#confettiContainer.innerHTML = "";
    }
    createConfettiPiece() {
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
    }
    getConfettiColor() {
      const colors = ["#ff6347", "#ffa500", "#32cd32", "#1e90ff", "#ff69b4"];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  };
  customElements.define("confetti-tag", Confetti);

  // src/modules/components/LoadingDialog.ts
  var LoadingDialog = class extends HTMLElement {
    #dialogElement;
    constructor() {
      super();
      this.show = this.show.bind(this);
      this.close = this.close.bind(this);
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
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(dialogElement);
    }
    show() {
      this.#dialogElement.showModal();
    }
    close() {
      this.#dialogElement.close();
    }
  };
  customElements.define("loading-dialog", LoadingDialog);

  // src/modules/managers/GameManager.ts
  var paddlesPositions = ["top", "right", "bottom", "left"];
  var Paddle = class {
    #player;
    position;
    vx;
    vy;
    width;
    height;
    x;
    y;
    dx = 0;
    dy = 0;
    colliding = false;
    constructor(player, position) {
      this.#player = player;
      this.position = position;
      this.width = position === "top" || position === "bottom" ? defaultPaddleLength : defaultPaddleDepth;
      this.height = position === "top" || position === "bottom" ? defaultPaddleDepth : defaultPaddleLength;
      switch (position) {
        case "top":
          this.width = defaultPaddleLength;
          this.height = defaultPaddleDepth;
          this.x = canvasDimension / 2 - this.width / 2;
          this.y = gridSize;
          this.vx = defaultPaddleSpeed;
          this.vy = 0;
          break;
        case "right":
          this.width = defaultPaddleDepth;
          this.height = defaultPaddleLength;
          this.x = canvasDimension - gridSize - this.width;
          this.y = canvasDimension / 2 - this.height / 2;
          this.vx = 0;
          this.vy = defaultPaddleSpeed;
          break;
        case "bottom":
          this.width = defaultPaddleLength;
          this.height = defaultPaddleDepth;
          this.x = canvasDimension / 2 - this.width / 2;
          this.y = canvasDimension - gridSize - this.height;
          this.vx = defaultPaddleSpeed;
          this.vy = 0;
          break;
        // Intentional overload
        case "left":
        default:
          this.width = defaultPaddleDepth;
          this.height = defaultPaddleLength;
          this.x = gridSize;
          this.y = canvasDimension / 2 - this.height / 2;
          this.vx = 0;
          this.vy = defaultPaddleSpeed;
          break;
      }
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      document.addEventListener("keydown", this.onKeyDown);
      document.addEventListener("keyup", this.onKeyUp);
    }
    onKeyDown(event) {
      const { keyup, keydown } = this.#player;
      if (event.key === keyup) {
        event.preventDefault();
        this.dx = this.vx;
        this.dy = -this.vy;
      } else if (event.key === keydown) {
        event.preventDefault();
        this.dx = -this.vx;
        this.dy = this.vy;
      }
    }
    onKeyUp(event) {
      const { keyup, keydown } = this.#player;
      if (event.key === keyup || event.key === keydown) {
        event.preventDefault();
        this.dx = 0;
        this.dy = 0;
      }
    }
    move() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x + this.width > canvasDimension) {
        this.x = canvasDimension - this.width;
      } else if (this.y < 0) {
        this.y = 0;
      } else if (this.y + this.height > canvasDimension) {
        this.y = canvasDimension - this.height;
      }
    }
    draw(context) {
      context.fillStyle = this.#player.getColor();
      context.fillRect(this.x, this.y, this.width, this.height);
    }
    remove() {
      document.removeEventListener("keydown", this.onKeyDown);
      document.removeEventListener("keyup", this.onKeyUp);
    }
  };
  var Ball = class {
    #player;
    #avatar;
    speed = defaultBallSpeed;
    width = defaultBallSize;
    height = defaultBallSize;
    x = defaultBallPosition;
    y = defaultBallPosition;
    dx = 0;
    dy = 0;
    colliding = false;
    constructor(player) {
      this.#player = player;
      const avatar = new Image(defaultBallSize - 5, defaultBallSize - 5);
      avatar.src = "./src/images/avatar.png";
      this.#avatar = avatar;
      this.reset();
    }
    reset() {
      this.x = defaultBallPosition;
      this.y = defaultBallPosition;
      this.dx = 0;
      this.dy = 0;
      window.setTimeout(() => {
        const angle = getRandomNumber(0, 360);
        this.dx = this.speed * Math.cos(angle);
        this.dy = this.speed * Math.sin(angle);
      }, 1e3);
    }
    move() {
      this.x += this.dx;
      this.y += this.dy;
    }
    // return null or the position it went past
    // can use that information to find the paddle
    // and through the paddle the player
    // then if ball and paddle belong to same player => negative score
    // else positive score
    isOutOfBounds() {
      return this.x - this.width < 0 || this.x > canvasDimension || this.y - this.height < 0 || this.y > canvasDimension;
    }
    draw(context) {
      console.log("what");
      context.fillStyle = this.#player.getColor();
      context.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
      context.drawImage(this.#avatar, this.x, this.y, this.width, this.height);
    }
  };
  var GameManager = class {
    #gameSettings;
    #scoreboard;
    #loadingDialog;
    #confetti;
    #context;
    #gameState;
    #winner = null;
    #players;
    #paddles = [];
    #balls = [];
    // score: Score[];
    constructor({ gameSettings, scoreboard, loadingDialog, confetti, context }) {
      this.#gameSettings = gameSettings;
      this.#scoreboard = scoreboard;
      this.#loadingDialog = loadingDialog;
      this.#confetti = confetti;
      this.#context = context;
      this.initializeGame = this.initializeGame.bind(this);
      this.createPaddles = this.createPaddles.bind(this);
      this.onSettingsChange = this.onSettingsChange.bind(this);
      this.update = this.update.bind(this);
      gameSettings.addEventListener("gameSettingsChange" /* GameSettingsChange */, this.onSettingsChange);
      this.initializeGame(gameSettings.data);
    }
    // The async-ness and the loading dialog are a joke, btw
    async initializeGame(players) {
      this.#loadingDialog.show();
      this.#gameState = 0 /* Initializing */;
      this.#winner = null;
      this.#players = players;
      this.#scoreboard.setScores(players);
      this.createPaddles();
      this.createBalls();
      this.#confetti.stop();
      window.setTimeout(() => {
        this.#gameState = 1 /* Ready */;
        this.#loadingDialog.close();
        this.start();
      }, 1e3);
    }
    async onSettingsChange(event) {
      if (isGameSettingsChangeEvent(event)) {
        this.initializeGame(event.detail);
      }
    }
    handlePlayerSettingsChanged() {
    }
    createPaddles() {
      const playerCount = this.#players.length;
      const paddles = [];
      this.#paddles.forEach((paddle) => {
        paddle.remove();
      });
      for (let i = 0; i < maxPlayers; i++) {
        const playerIndex = (i % playerCount + playerCount) % playerCount;
        const player = isNaN(playerIndex) ? createDefaultPlayer(0) : this.#players[playerIndex];
        const position = paddlesPositions[i];
        if (position) {
          if (player) {
            paddles.push(new Paddle(player, position));
          } else {
            throw new Error(`GameManager ~ createPaddles: No player found at index ${playerIndex}`);
          }
        } else {
          throw new Error(`GameManager ~ createPaddles: No paddle found for index ${i}`);
        }
      }
      this.#paddles = paddles;
    }
    createBalls() {
      const balls = [];
      if (this.#players.length === 0) {
        for (let i = 0; i < maxPlayers; i++) {
          balls.push(new Ball(createDefaultPlayer(0)));
        }
      } else {
        this.#players.forEach((player) => {
          balls.push(new Ball(player));
        });
      }
      this.#balls = balls;
    }
    checkCollision() {
    }
    handleCollision() {
    }
    checkGoal() {
    }
    updateScore() {
    }
    handleWinner(player) {
      this.#winner = player;
      this.#confetti.start();
      this.#gameState = 3 /* Winner */;
    }
    start() {
      requestAnimationFrame(this.update);
    }
    stop() {
    }
    update() {
      this.#context.clearRect(0, 0, canvasDimension, canvasDimension);
      if (this.#gameState === 0 /* Initializing */) {
        return;
      }
      if (this.#gameState === 1 /* Ready */) {
        this.#paddles.forEach((paddle) => {
          paddle.move();
          paddle.draw(this.#context);
        });
        this.#balls.forEach((ball) => {
          ball.move();
          if (ball.isOutOfBounds()) {
            ball.reset();
          }
          ball.draw(this.#context);
        });
      }
      if (this.#gameState === 3 /* Winner */) {
      }
      if (this.#gameState === 2 /* Running */) {
      }
      requestAnimationFrame(this.update);
    }
  };

  // src/modules/components/PlayerScore.ts
  var PlayerScore = class extends HTMLElement {
    #containerElement;
    #nameElement;
    #scoreElement;
    id = "";
    name = "";
    score = "";
    color = "";
    static observedAttributes = ["id", "name", "score", "color"];
    constructor() {
      super();
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
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(containerElement);
    }
    attributeChangedCallback(name, oldValue, newValue) {
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
  };
  customElements.define("player-score", PlayerScore);

  // src/modules/components/Scoreboard.ts
  var Scoreboard = class extends HTMLElement {
    #scoresElement;
    constructor() {
      super();
      this.setScores = this.setScores.bind(this);
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
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(containerElement);
    }
    setScores(players) {
      this.#scoresElement.innerHTML = "";
      for (const player of players) {
        this.createPlayerScore(player);
      }
    }
    createPlayerScore(player) {
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
  };
  customElements.define("score-board", Scoreboard);

  // src/app.ts
  var initApp = () => {
    const root = document.getElementById("root");
    if (root) {
      const gameSettings = document.createElement("game-settings");
      if (gameSettings instanceof GameSettings) {
        root.appendChild(gameSettings);
        const scoreboard = document.createElement("score-board");
        if (scoreboard instanceof Scoreboard) {
          root.appendChild(scoreboard);
          const canvas = document.createElement("canvas");
          canvas.setAttribute("width", `${canvasDimension}px`);
          canvas.setAttribute("height", `${canvasDimension}px`);
          root.appendChild(canvas);
          const context = canvas.getContext("2d");
          if (context) {
            const loadingDialog = document.createElement("loading-dialog");
            if (loadingDialog instanceof LoadingDialog) {
              root.appendChild(loadingDialog);
              const confetti = document.createElement("confetti-tag");
              if (confetti instanceof Confetti) {
                root.appendChild(confetti);
                const gameManager = new GameManager({
                  gameSettings,
                  scoreboard,
                  loadingDialog,
                  confetti,
                  context
                });
              } else {
                throw new Error("initApp: confetti is not instance of Confetti");
              }
            } else {
              throw new Error("initApp: loadingDialog is not instance of LoadingDialog");
            }
          } else {
            throw new Error("initApp: context is null");
          }
        } else {
          throw new Error("initApp: scoreboard is not instance of Scoreboard");
        }
      } else {
        throw new Error("initApp: gameSettings not instance of GameSettings");
      }
    } else {
      throw new Error("initApp: Couldn't find root");
    }
  };
  initApp();
})();
