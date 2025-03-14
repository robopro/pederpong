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
  var isColor = (obj) => typeof obj === "string" && Object.values(Color).includes(obj);
  var Sound = /* @__PURE__ */ ((Sound2) => {
    Sound2["Eagle"] = "eagle.mp3";
    Sound2["Goat"] = "goat.mp3";
    Sound2["Monster"] = "monster.mp3";
    Sound2["TRex"] = "trex.mp3";
    return Sound2;
  })(Sound || {});
  var isSound = (obj) => typeof obj === "string" && Object.values(Sound).includes(obj);
  var positions = ["top", "right", "bottom", "left"];

  // src/modules/classes/Ball.ts
  var Ball = class _Ball {
    static #lastId = 0;
    static generateId() {
      this.#lastId += 1;
      return this.#lastId;
    }
    static usedStartingPositions = /* @__PURE__ */ new Set();
    #id;
    #player;
    #avatar;
    #startingX;
    #startingY;
    #canCollide = false;
    width = defaultBallSize;
    height = defaultBallSize;
    x;
    y;
    dx = 0;
    dy = 0;
    pointValue = defaultBallPointValue;
    constructor(player) {
      this.#id = _Ball.generateId();
      this.#player = player;
      const { x, y } = getStartingPosition(_Ball.usedStartingPositions, this.width, this.height);
      this.#startingX = x;
      this.#startingY = y;
      this.x = x;
      this.y = y;
      const avatar = new Image(defaultBallSize - 5, defaultBallSize - 5);
      avatar.src = "./src/images/avatar.png";
      this.#avatar = avatar;
      this.reset();
    }
    reset = () => {
      this.#canCollide = false;
      this.x = this.#startingX;
      this.y = this.#startingY;
      this.dx = 0;
      this.dy = 0;
      window.setTimeout(() => {
        const angle = getRandomNumber(0, 360);
        this.dx = defaultBallSpeed * Math.cos(angle);
        this.dy = defaultBallSpeed * Math.sin(angle);
        this.#canCollide = true;
      }, 1e3);
    };
    move = () => {
      this.x += this.dx;
      this.y += this.dy;
    };
    isOutOfBounds = () => {
      if (this.x + this.width < 0) {
        return "left";
      }
      if (this.x > canvasDimension) {
        return "right";
      }
      if (this.y + this.height < 0) {
        return "top";
      }
      if (this.y > canvasDimension) {
        return "bottom";
      }
      return null;
    };
    draw = (context) => {
      context.fillStyle = this.#player.getColor();
      context.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
      context.drawImage(this.#avatar, this.x, this.y, this.width, this.height);
    };
    get id() {
      return this.#id;
    }
    get player() {
      return this.#player;
    }
    get canCollide() {
      return this.#canCollide;
    }
  };

  // src/modules/classes/Player.ts
  var Player = class _Player {
    static #currentId = 0;
    static generateId() {
      this.#currentId += 1;
      return this.#currentId;
    }
    #audioElement;
    #id;
    #score = 0;
    #name;
    #color;
    #sound;
    #keyUp;
    #keyDown;
    canWin = true;
    constructor({ name, color, sound, keyup, keydown }) {
      this.#id = _Player.generateId();
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
    addScore = (amount) => {
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
  };

  // src/modules/utils.ts
  var confettiColors = ["#ff6347", "#ffa500", "#32cd32", "#1e90ff", "#ff69b4"];
  var baseAudioUrl = "src/audio/";
  var frameRate = 1e3 / 60;
  var maxPlayers = 4;
  var canvasDimension = 800;
  var gridSize = 20;
  var winningScore = 9;
  var startGameKey = " ";
  var defaultPaddleLength = gridSize * 4;
  var defaultPaddleDepth = gridSize;
  var defaultPaddleSpeed = 16;
  var defaultBallSize = gridSize;
  var defaultBallSpeed = 8;
  var defaultBallPosition = canvasDimension / 2 - defaultBallSize / 2;
  var defaultBallPointValue = 1;
  var defaultKeys = [
    ["w", "s"],
    ["r", "f"],
    ["y", "h"],
    ["i", "k"],
    ["o", "l"]
  ];
  var defaultPlayerFormData = [
    {
      name: "John",
      color: "blue" /* Blue */,
      sound: "eagle.mp3" /* Eagle */,
      keyup: defaultKeys[0][0],
      keydown: defaultKeys[0][1]
    },
    {
      name: "Jane",
      color: "green" /* Green */,
      sound: "goat.mp3" /* Goat */,
      keyup: defaultKeys[1][0],
      keydown: defaultKeys[1][1]
    },
    {
      name: "Jone",
      color: "red" /* Red */,
      sound: "monster.mp3" /* Monster */,
      keyup: defaultKeys[2][0],
      keydown: defaultKeys[2][1]
    },
    {
      name: "Jahn",
      color: "yellow" /* Yellow */,
      sound: "trex.mp3" /* TRex */,
      keyup: defaultKeys[3][0],
      keydown: defaultKeys[3][1]
    },
    {
      name: "Smith",
      color: "yellow" /* Yellow */,
      sound: "trex.mp3" /* TRex */,
      keyup: defaultKeys[4][0],
      keydown: defaultKeys[4][1]
    }
  ];
  var createDefaultPlayer = (index) => {
    const playerFormData = defaultPlayerFormData[index] ? defaultPlayerFormData[index] : defaultPlayerFormData[0];
    const newPlayerFormData = { ...playerFormData };
    newPlayerFormData.keyup = void 0;
    newPlayerFormData.keydown = void 0;
    const player = new Player(newPlayerFormData);
    return player;
  };
  var getStartingPosition = (usedPositions, width, height) => {
    const newPosition = positions.find((position) => !usedPositions.has(position)) ?? "left";
    usedPositions.add(newPosition);
    const midX = canvasDimension / 2 - width / 2;
    const midY = canvasDimension / 2 - height / 2;
    switch (newPosition) {
      case "top":
        return { x: midX, y: midY - height - height };
      case "right":
        return { x: midX + width + width, y: midY };
      case "bottom":
        return { x: midX, y: midY + height + height };
      case "left":
      default:
        return { x: midX - width - width, y: midY };
    }
  };
  var isCollision = (a, b) => {
    if (!a.canCollide) {
      return false;
    }
    if (b instanceof Ball && !b.canCollide) {
      return false;
    }
    return !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y);
  };
  var solveBallBallCollision = (a, b) => {
    const vCollision = { x: b.x - a.x, y: b.y - a.y };
    const distance = Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
    const vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };
    const vRelativeVelocity = { x: a.dx - b.dx, y: a.dy - b.dy };
    const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
    if (speed < 0) {
      return;
    }
    a.dx -= speed * vCollisionNorm.x;
    a.dy -= speed * vCollisionNorm.y;
    b.dx += speed * vCollisionNorm.x;
    b.dy += speed * vCollisionNorm.y;
  };
  var solveBallPaddleCollision = (ball, paddle) => {
    const paddleCenter = { x: paddle.x + paddle.width / 2, y: paddle.y + paddle.height / 2 };
    const distanceFromCenter = { x: paddleCenter.x - ball.x, y: paddleCenter.y - ball.y };
    if (paddle.position === "top" && ball.dy < 0 || paddle.position === "bottom" && ball.dy > 0) {
      ball.dx += distanceFromCenter.x * -0.1;
      ball.dy *= -1;
    } else if (paddle.position === "right" && ball.dx > 0 || paddle.position === "left" && ball.dx < 0) {
      ball.dx *= -1;
      ball.dy += distanceFromCenter.y * -0.1;
    }
  };
  var getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  var getRandomInt = (min, max) => {
    return Math.floor(getRandomNumber(min, max));
  };

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
    showDialog = () => {
      this.#dialogElement.addEventListener("keyup", this.onKeyUp);
      this.#dialogElement.showModal();
    };
    onAttributeChanged = (name, value) => {
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
      }
    };
    onKeyUp = (event) => {
      if (this.#dialogElement.open) {
        this.changeKey(event.key);
      }
    };
    changeKey = (key) => {
      if (key !== "Esc" && key !== "Escape") {
        this.value = key;
        this.#buttonElement.value = key;
        this.dispatchEvent(createCustomEvent("keybindChange" /* KeybindChange */, key));
      }
      this.#dialogElement.removeEventListener("keyup", this.onKeyUp);
      this.#dialogElement.close();
    };
  };
  customElements.define("keybind-form", KeybindForm);

  // src/modules/components/PlayerForm.ts
  var PlayerForm = class extends HTMLElement {
    #nameInput;
    #colorInput;
    #soundInput;
    #keyUpInput;
    #keyDownInput;
    name;
    color;
    sound;
    keyup;
    keydown;
    static observedAttributes = ["name", "color", "sound", "keyup", "keydown"];
    constructor(defaultPlayerIndex = 0) {
      super();
      const { name, color, sound, keyup, keydown } = defaultPlayerFormData[defaultPlayerIndex] ?? defaultPlayerFormData[0];
      this.name = name;
      this.color = color;
      this.sound = sound;
      this.keyup = keyup;
      this.keydown = keydown;
      const shadow = this.attachShadow({ mode: "open" });
      const playerForm = document.createElement("form");
      shadow.appendChild(playerForm);
      playerForm.classList.add("player-form");
      const colorOptions = Object.values(Color).map((color2) => `<option value=${color2}>${color2}</option>`).join();
      const soundOptions = Object.values(Sound).map((sound2) => `<option value=${sound2}>${sound2.split(".mp3").shift()}</option>`).join();
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
        this.#nameInput = nameElement;
        this.#colorInput = colorElement;
        this.#soundInput = soundElement;
        this.#keyUpInput = keyUpElement;
        this.#keyUpInput.setAttribute("value", this.keyup);
        this.#keyDownInput = keyDownElement;
        this.#keyDownInput.setAttribute("value", this.keydown);
      } else {
        throw new Error("PlayerForm ~ constructor: Couldn't find internal elements");
      }
    }
    connectedCallback() {
      this.#nameInput.addEventListener("change", this.onFormChange);
      this.#colorInput.addEventListener("change", this.onFormChange);
      this.#soundInput.addEventListener("change", this.onFormChange);
      this.#keyUpInput.addEventListener("keybindChange" /* KeybindChange */, this.onFormChange);
      this.#keyDownInput.addEventListener("keybindChange" /* KeybindChange */, this.onFormChange);
    }
    disconnectedCallback() {
      this.#nameInput.removeEventListener("change", this.onFormChange);
      this.#colorInput.removeEventListener("change", this.onFormChange);
      this.#soundInput.removeEventListener("change", this.onFormChange);
      this.#keyUpInput.removeEventListener("keybindChange" /* KeybindChange */, this.onFormChange);
      this.#keyDownInput.removeEventListener("keybindChange" /* KeybindChange */, this.onFormChange);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue !== oldValue) {
        this.handleChange(name, newValue);
      }
    }
    onFormChange = (event) => {
      const { currentTarget } = event;
      if (currentTarget instanceof HTMLSelectElement || currentTarget instanceof HTMLInputElement || currentTarget instanceof KeybindForm) {
        const { name, value } = currentTarget;
        this.handleChange(name, value);
      }
    };
    handleChange = (name, value) => {
      switch (name) {
        case "name":
          this.name = value;
          this.#nameInput.value = value;
          break;
        case "color":
          if (isColor(value)) {
            this.color = value;
            this.#colorInput.value = value;
          }
          break;
        case "sound":
          if (isSound(value)) {
            this.sound = value;
            this.#soundInput.value = value;
          }
          break;
        case "keyup":
          this.keyup = value;
          this.#keyUpInput.setAttribute("value", value);
          break;
        case "keydown":
          this.keydown = value;
          this.#keyDownInput.setAttribute("value", value);
          break;
      }
      this.dispatchEvent(createCustomEvent("playerFormChange" /* PlayerFormChange */, null));
    };
    getFormData = () => {
      return {
        name: this.name,
        color: this.color,
        sound: this.sound,
        keyup: this.keyup,
        keydown: this.keydown
      };
    };
    setFormData = ({ name, color, sound, keyup, keydown }) => {
      this.name = name;
      this.#nameInput.value = name;
      this.color = color;
      this.#colorInput.value = color;
      this.sound = sound;
      this.#soundInput.value = sound;
      this.keyup = keyup;
      this.#keyUpInput.setAttribute("value", keyup);
      this.keydown = keydown;
      this.#keyDownInput.setAttribute("value", keydown);
    };
  };
  customElements.define("player-form", PlayerForm);

  // src/modules/components/GameSettings.ts
  var GameSettings = class extends HTMLElement {
    #playerFormsContainer;
    #playerForms = [];
    #playerCountInput;
    constructor() {
      super();
      this.#playerForms = [];
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
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(playerSettingsContainer);
      const playerCountInput = this.shadowRoot?.querySelector(".player-count");
      const playerFormsContainer = this.shadowRoot?.querySelector(".player-forms-container");
      if (playerCountInput instanceof HTMLSelectElement && playerFormsContainer instanceof HTMLDivElement) {
        this.#playerCountInput = playerCountInput;
        this.#playerFormsContainer = playerFormsContainer;
      } else {
        throw new Error(
          "PlayerSettings ~ constructor: Couldn't find select element or forms container element"
        );
      }
      this.addPlayerForms(2);
    }
    connectedCallback() {
      this.#playerCountInput.addEventListener("change", this.setPlayerForms);
    }
    disconnectedCallback() {
      this.removePlayerForms(this.#playerForms.length);
      this.#playerCountInput.removeEventListener("change", this.setPlayerForms);
    }
    setPlayerForms = (event) => {
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
        "PlayerSettings ~ setPlayers: event.currentTarget is not an instance of HTMLSelectElement"
      );
    };
    addPlayerForms = (amount) => {
      if (amount > 0) {
        const newPlayerForms = [...this.#playerForms];
        for (let i = 0; i < amount; i++) {
          const playerFormIndex = this.#playerForms.length + i;
          const playerForm = new PlayerForm(playerFormIndex);
          playerForm.addEventListener("playerFormChange" /* PlayerFormChange */, this.onPlayerFormChange);
          this.#playerFormsContainer.appendChild(playerForm);
          newPlayerForms.push(playerForm);
        }
        this.playerForms = newPlayerForms;
      }
    };
    removePlayerForms = (amount) => {
      if (amount > 0) {
        const newPlayerForms = this.#playerForms.slice(0, -amount);
        const formsToRemove = this.#playerForms.splice(-amount);
        formsToRemove.forEach((playerForm) => {
          playerForm.removeEventListener("playerFormChange" /* PlayerFormChange */, this.onPlayerFormChange);
          playerForm.remove();
        });
        this.playerForms = newPlayerForms;
      }
    };
    onPlayerFormChange = (event) => {
      if (isPlayerFormChangeEvent(event)) {
        event.stopImmediatePropagation();
        this.dispatchEvent(createCustomEvent("gameSettingsChange" /* GameSettingsChange */, null));
      }
    };
    get playerForms() {
      return this.#playerForms;
    }
    set playerForms(playerForms) {
      this.#playerForms = playerForms;
      this.dispatchEvent(createCustomEvent("gameSettingsChange" /* GameSettingsChange */, null));
    }
  };
  customElements.define("game-settings", GameSettings);

  // src/modules/components/Confetti.ts
  var Confetti = class extends HTMLElement {
    #confettiContainer;
    constructor() {
      super();
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
    start = () => {
      for (let i = 0; i < 150; i++) {
        this.createConfettiPiece();
      }
    };
    stop = () => {
      this.#confettiContainer.innerHTML = "";
    };
    createConfettiPiece = () => {
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
    getConfettiColor = () => {
      const index = Math.floor(Math.random() * confettiColors.length);
      return confettiColors[index] ?? confettiColors[0];
    };
  };
  customElements.define("confetti-tag", Confetti);

  // src/modules/components/LoadingDialog.ts
  var LoadingDialog = class extends HTMLElement {
    #dialogElement;
    constructor() {
      super();
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
    show = () => {
      this.#dialogElement.showModal();
    };
    close = () => {
      this.#dialogElement.close();
    };
  };
  customElements.define("loading-dialog", LoadingDialog);

  // src/modules/classes/Paddle.ts
  var Paddle = class _Paddle {
    static #lastId = 0;
    static generateId() {
      this.#lastId += 1;
      return this.#lastId;
    }
    #id;
    #player;
    position;
    width;
    height;
    x;
    y;
    dx = 0;
    dy = 0;
    vx;
    vy;
    colliding = false;
    constructor(player, position) {
      this.#id = _Paddle.generateId();
      this.#player = player;
      this.position = position;
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
      const { keyUp, keyDown } = player.keys;
      if (keyUp && keyDown) {
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
      }
    }
    onKeyDown = (event) => {
      const { keyUp, keyDown } = this.#player.keys;
      if (event.key === keyUp) {
        event.preventDefault();
        this.dx = this.vx;
        this.dy = -this.vy;
      } else if (event.key === keyDown) {
        event.preventDefault();
        this.dx = -this.vx;
        this.dy = this.vy;
      }
    };
    onKeyUp = (event) => {
      const { keyUp, keyDown } = this.#player.keys;
      if (event.key === keyUp || event.key === keyDown) {
        event.preventDefault();
        this.dx = 0;
        this.dy = 0;
      }
    };
    move = () => {
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
    };
    draw = (context) => {
      context.fillStyle = this.#player.getColor();
      context.fillRect(this.x, this.y, this.width, this.height);
    };
    delete = () => {
      document.removeEventListener("keydown", this.onKeyDown);
      document.removeEventListener("keyup", this.onKeyUp);
    };
    get id() {
      return this.#id;
    }
    get player() {
      return this.#player;
    }
  };

  // src/modules/components/PlayerScoreboard.ts
  var PlayerScoreboard = class extends HTMLElement {
    #containerElement;
    #nameElement;
    #scoreElement;
    playerid = "";
    name = "";
    score = "";
    color = "";
    static observedAttributes = ["playerid", "name", "score", "color"];
    constructor({ playerId, name, score, color }) {
      super();
      this.playerid = playerId;
      this.name = name;
      this.score = score;
      this.color = color;
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
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(containerElement);
    }
    attributeChangedCallback(name, oldValue, newValue) {
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
    setPlayerScoreboardData = ({ playerId, name, score, color }) => {
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
  };
  customElements.define("player-scoreboard", PlayerScoreboard);

  // src/modules/managers/GameManager.ts
  var GameManager = class {
    #gameSettings;
    #scoreboardContainer;
    #playerScoreboards = [];
    #canvas;
    #context;
    #loadingDialog;
    #confetti;
    #gameState = 0 /* Initializing */;
    #winners = [];
    #players = [];
    #paddles = [];
    #balls = [];
    #lastRenderTime = Date.now();
    constructor({
      gameSettings,
      scoreboardContainer,
      loadingDialog,
      confetti,
      canvas
    }) {
      this.#gameSettings = gameSettings;
      this.#scoreboardContainer = scoreboardContainer;
      this.#loadingDialog = loadingDialog;
      this.#confetti = confetti;
      this.#canvas = canvas;
      const context = canvas.getContext("2d");
      if (context) {
        this.#context = context;
        this.#context.font = "bold xx-large monospace";
        this.#context.textAlign = "center";
      } else {
        throw new Error("GameManager - constructor: No context found for canvas");
      }
      this.#gameSettings.addEventListener("gameSettingsChange" /* GameSettingsChange */, this.onSettingsChange);
    }
    onSettingsChange = (event) => {
      if (isGameSettingsChangeEvent(event)) {
        this.initializeGame();
      }
    };
    // Call this method to start the game!
    // The async-ness is a joke, btw
    initializeGame = async () => {
      document.removeEventListener("keyup", this.setGameStateRunning);
      document.removeEventListener("keyup", this.restart);
      this.#gameState = 0 /* Initializing */;
      this.#loadingDialog.show();
      this.#confetti.stop();
      Ball.usedStartingPositions = /* @__PURE__ */ new Set();
      this.#winners = [];
      this.resetCanvasRotation();
      this.createPlayers();
      this.createPlayerScoreboards();
      this.createPaddles();
      this.createBalls();
      this.loading();
    };
    loading = () => {
      window.setTimeout(() => {
        this.setGameStateReady();
        this.#loadingDialog.close();
        this.start();
      }, 1e3);
    };
    createPlayers = () => {
      this.#players = [];
      const playerFormData = this.#gameSettings.playerForms.map(
        (playerForm) => playerForm.getFormData()
      );
      for (let i = 0; i < playerFormData.length; i++) {
        const formData = playerFormData[i];
        if (formData) {
          const player = new Player(formData);
          if (i >= maxPlayers) {
            player.canWin = false;
          }
          this.#players.push(player);
        }
      }
    };
    createPlayerScoreboards = () => {
      this.#scoreboardContainer.removePlayerScoreboards();
      this.#playerScoreboards = [];
      for (const player of this.#players) {
        const playerScoreboard = new PlayerScoreboard({
          playerId: player.id.toLocaleString(),
          name: player.name,
          color: player.color,
          score: player.score.toLocaleString()
        });
        this.#scoreboardContainer.addPlayerScoreboard(playerScoreboard);
        this.#playerScoreboards.push(playerScoreboard);
      }
    };
    updatePlayerScoreboards = () => {
      for (const playerScoreboard of this.#playerScoreboards) {
        const player = this.#players.find(
          (player2) => player2.id.toLocaleString() === playerScoreboard.playerid
        );
        if (player) {
          playerScoreboard.setPlayerScoreboardData({ score: player.score.toLocaleString() });
        }
      }
    };
    createPaddles = () => {
      this.#paddles.forEach((paddle) => {
        paddle.delete();
      });
      this.#paddles = [];
      const playerCount = this.#players.length > maxPlayers ? maxPlayers : this.#players.length;
      for (let i = 0; i < maxPlayers; i++) {
        const playerIndex = (i % playerCount + playerCount) % playerCount;
        const player = isNaN(playerIndex) ? createDefaultPlayer(i) : this.#players[playerIndex];
        const position = positions[i];
        if (position) {
          if (player) {
            this.#paddles.push(new Paddle(player, position));
          } else {
            throw new Error(`GameManager ~ createPaddles: No player found at index ${playerIndex}`);
          }
        } else {
          throw new Error(`GameManager ~ createPaddles: No paddle found for index ${i}`);
        }
      }
    };
    createBalls = () => {
      this.#balls = [];
      if (this.#players.length === 0) {
        for (let i = 0; i < maxPlayers; i++) {
          this.#balls.push(new Ball(createDefaultPlayer(i)));
        }
      } else {
        const playerCount = this.#players.length > maxPlayers ? maxPlayers : this.#players.length;
        for (let i = 0; i < playerCount; i++) {
          const player = this.#players[i];
          if (player) {
            this.#balls.push(new Ball(player));
          }
        }
      }
    };
    setGameStateReady = () => {
      document.addEventListener("keyup", this.setGameStateRunning);
      this.#gameState = 1 /* Ready */;
    };
    setGameStateRunning = (event) => {
      if (event.key === startGameKey) {
        document.removeEventListener("keyup", this.setGameStateRunning);
        this.#gameState = 2 /* Running */;
      }
    };
    setGameStateWinner = () => {
      this.#confetti.start();
      this.#gameState = 3 /* Winner */;
      document.addEventListener("keyup", this.restart);
    };
    move = () => {
      this.#paddles.forEach((paddle) => {
        paddle.move();
      });
      this.#balls.forEach((ball) => {
        ball.move();
      });
    };
    checkGoals = () => {
      for (const ball of this.#balls) {
        const goalPosition = ball.isOutOfBounds();
        if (goalPosition) {
          this.updatePlayerScores(ball, goalPosition);
          this.updatePlayerScoreboards();
          ball.reset();
        }
      }
    };
    updatePlayerScores = (ball, goalPosition) => {
      const paddle = this.#paddles.find((paddle2) => paddle2.position === goalPosition);
      const paddlePlayerId = paddle?.player.id;
      const ballPlayerId = ball.player.id;
      const isOwnGoal = paddlePlayerId === ballPlayerId;
      for (const player of this.#players) {
        if (player.canWin) {
          if (isOwnGoal && player.id === ballPlayerId) {
            player.addScore(-ball.pointValue);
          } else if (player.id !== paddlePlayerId) {
            player.addScore(ball.pointValue);
          }
        }
      }
    };
    checkWinners = () => {
      for (const player of this.#players) {
        if (player.score >= winningScore) {
          this.#winners.push(player);
        }
      }
      if (this.#winners.length > 0) {
        this.setGameStateWinner();
      }
    };
    checkCollision = () => {
      for (const ballA of this.#balls) {
        for (const ballB of this.#balls) {
          if (ballA.id !== ballB.id && isCollision(ballA, ballB)) {
            solveBallBallCollision(ballA, ballB);
          }
        }
        for (const paddle of this.#paddles) {
          if (isCollision(ballA, paddle)) {
            solveBallPaddleCollision(ballA, paddle);
            ballA.player.playAudio();
            this.rotateCanvasRandomly();
          }
        }
      }
    };
    resetCanvasRotation = () => {
      this.#canvas.style.transform = "rotate(0deg)";
    };
    rotateCanvasRandomly = () => {
      const rotateAngle = `${getRandomNumber(-360, 360)}deg`;
      const rotate3dAngle = `${getRandomNumber(15, 45)}deg`;
      const { x, y, z } = { x: Math.random(), y: Math.random(), z: Math.random() };
      const transform = `rotate(${rotateAngle}) rotate3d(${x}, ${y}, ${z}, ${rotate3dAngle})`;
      this.#canvas.style.transform = transform;
    };
    draw = () => {
      for (const paddle of this.#paddles) {
        paddle.draw(this.#context);
      }
      for (const ball of this.#balls) {
        ball.draw(this.#context);
      }
    };
    start = () => {
      requestAnimationFrame(this.update);
    };
    restart = (event) => {
      if (event.key === startGameKey) {
        document.removeEventListener("keyup", this.restart);
        this.#winners = [];
        this.#confetti.stop();
        this.resetCanvasRotation();
        for (const player of this.#players) {
          player.reset();
        }
        this.updatePlayerScoreboards();
        for (const ball of this.#balls) {
          ball.reset();
        }
        this.setGameStateReady();
      }
    };
    update = () => {
      const now = Date.now();
      const deltaTime = now - this.#lastRenderTime;
      if (deltaTime > frameRate) {
        this.#lastRenderTime = now;
        this.#context.clearRect(0, 0, canvasDimension, canvasDimension);
        if (this.#gameState === 4 /* Stopped */) {
          return;
        }
        if (this.#gameState === 1 /* Ready */) {
          this.drawStartScreen();
        }
        if (this.#gameState === 3 /* Winner */) {
          this.drawWinners();
        }
        if (this.#gameState === 2 /* Running */) {
          this.move();
          this.checkGoals();
          this.checkWinners();
          this.checkCollision();
          this.draw();
        }
      }
      requestAnimationFrame(this.update);
    };
    drawStartScreen = () => {
      const text = "Press SPACE to start";
      this.#context.fillStyle = Math.random() < 0.5 ? "white" : "transparent";
      this.#context.fillText(text, canvasDimension / 2, 100);
    };
    drawWinners = () => {
      const textHeight = this.#context.measureText("M").width + 20;
      this.#winners.forEach((winner, index) => {
        const text2 = `${winner.name} wins!`;
        this.#context.fillStyle = winner.getColor();
        this.#context.fillText(text2, canvasDimension / 2, 100 + textHeight * index);
      });
      const text = "Press SPACE to play again";
      this.#context.fillStyle = Math.random() < 0.5 ? "white" : "transparent";
      this.#context.fillText(
        text,
        canvasDimension / 2,
        100 + textHeight + textHeight * this.#winners.length
      );
    };
  };

  // src/modules/components/ScoreboardContainer.ts
  var ScoreboardContainer = class extends HTMLElement {
    #scoresContainer;
    constructor() {
      super();
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
      const shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(containerElement);
    }
    addPlayerScoreboard = (playerScoreboard) => {
      this.#scoresContainer.appendChild(playerScoreboard);
    };
    removePlayerScoreboards = () => {
      this.#scoresContainer.innerHTML = "";
    };
    get scoresContainer() {
      return this.#scoresContainer;
    }
  };
  customElements.define("scoreboard-container", ScoreboardContainer);

  // src/app.ts
  var initApp = () => {
    const root = document.getElementById("root");
    if (root) {
      const gameSettings = document.createElement("game-settings");
      if (gameSettings instanceof GameSettings) {
        root.appendChild(gameSettings);
        const scoreboardContainer = document.createElement("scoreboard-container");
        if (scoreboardContainer instanceof ScoreboardContainer) {
          root.appendChild(scoreboardContainer);
          const canvas = document.createElement("canvas");
          canvas.setAttribute("width", `${canvasDimension}px`);
          canvas.setAttribute("height", `${canvasDimension}px`);
          root.appendChild(canvas);
          const loadingDialog = document.createElement("loading-dialog");
          if (loadingDialog instanceof LoadingDialog) {
            root.appendChild(loadingDialog);
            const confetti = document.createElement("confetti-tag");
            if (confetti instanceof Confetti) {
              root.appendChild(confetti);
              const gameManager = new GameManager({
                gameSettings,
                scoreboardContainer,
                loadingDialog,
                confetti,
                canvas
              });
              gameManager.initializeGame();
            } else {
              throw new Error("initApp: confetti is not instance of Confetti");
            }
          } else {
            throw new Error("initApp: loadingDialog is not instance of LoadingDialog");
          }
        } else {
          throw new Error("initApp: scoreboardContainer is not instance of ScoreboardContainer");
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
