/**
 * Keeps track of players
 * To do that it needs to keep track of the inputs
 *      => This guy handles creating the inputs and dealing with those
 *
 * Because this guy keeps track of players it makes sense he handles scores as well
 *
 * So. GameManager implements:
 *    PlayerManager
 *    Setting components (through another manager/component?)
 *    Score/ScoreboardManager
 *
 * Also keeps track of whether game is running or not.
 */

import { Player, PlayerForm } from "../components/PlayerForm";
import { GameSettings } from "../components/GameSettings";
import { Scoreboard } from "../components/Scoreboard";
import { CustomEventType, isGameSettingsChangeEvent } from "../types";
import { LoadingDialog } from "../components/LoadingDialog";
import { Confetti } from "../components/Confetti";
import {
  canvasDimension,
  gridSize,
  maxPlayers,
  defaultPaddleDepth,
  defaultPaddleLength,
  defaultPaddleSpeed,
  defaultPlayers,
  createDefaultPlayer,
  defaultBallSpeed,
  defaultBallSize,
  defaultBallPosition,
  getRandomNumber,
} from "../variables";

const paddlesPositions = ["top", "right", "bottom", "left"] as const;

type PaddlePosition = (typeof paddlesPositions)[number];
// enum PaddlePosition {
//   Top,
//   Right,
//   Bottom,
//   Left,
// }

// interface Paddle {
//   playerId: string;
//   color: string;
//   position: PaddlePosition;
//   speed: number;
//   width: number;
//   height: number;
//   x: number;
//   y: number;
//   dx: number;
//   dy: number;
//   colliding: boolean;
// }

class Paddle {
  #player: PlayerForm;
  position: PaddlePosition;
  vx: number;
  vy: number;
  width: number;
  height: number;
  x: number;
  y: number;
  dx: number = 0;
  dy: number = 0;
  colliding: boolean = false;

  constructor(player: PlayerForm, position: PaddlePosition) {
    this.#player = player;
    this.position = position;

    this.width =
      position === "top" || position === "bottom" ? defaultPaddleLength : defaultPaddleDepth;
    this.height =
      position === "top" || position === "bottom" ? defaultPaddleDepth : defaultPaddleLength;

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

  onKeyDown(event: KeyboardEvent) {
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

  onKeyUp(event: KeyboardEvent) {
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

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.#player.getColor();
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  remove() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }
}

class Ball {
  #player: PlayerForm;
  #avatar: HTMLImageElement;
  speed: number = defaultBallSpeed;
  width: number = defaultBallSize;
  height: number = defaultBallSize;
  x: number = defaultBallPosition;
  y: number = defaultBallPosition;
  dx: number = 0;
  dy: number = 0;
  colliding: boolean = false;

  constructor(player: PlayerForm) {
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
    }, 1000);
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
    return (
      this.x - this.width < 0 ||
      this.x > canvasDimension ||
      this.y - this.height < 0 ||
      this.y > canvasDimension
    );
  }

  draw(context: CanvasRenderingContext2D) {
    console.log("what");
    context.fillStyle = this.#player.getColor();
    context.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    context.drawImage(this.#avatar, this.x, this.y, this.width, this.height);
  }
}

enum GameState {
  Initializing,
  Ready,
  Running,
  Winner,
}

interface GameManagerProps {
  gameSettings: GameSettings;
  scoreboard: Scoreboard;
  loadingDialog: LoadingDialog;
  confetti: Confetti;
  context: CanvasRenderingContext2D;
}

export class GameManager {
  #gameSettings: GameSettings;
  #scoreboard: Scoreboard;
  #loadingDialog: LoadingDialog;
  #confetti: Confetti;
  #context: CanvasRenderingContext2D;

  #gameState: GameState;
  #winner: PlayerForm | null = null;
  #players: PlayerForm[];

  #paddles: Paddle[] = [];
  #balls: Ball[] = [];
  // score: Score[];

  constructor({ gameSettings, scoreboard, loadingDialog, confetti, context }: GameManagerProps) {
    // this.#gameState = GameState.Initializing;

    // Initialize properties
    this.#gameSettings = gameSettings;
    this.#scoreboard = scoreboard;
    this.#loadingDialog = loadingDialog;
    this.#confetti = confetti;
    this.#context = context;

    // Binding functions
    this.initializeGame = this.initializeGame.bind(this);
    this.createPaddles = this.createPaddles.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.update = this.update.bind(this);

    // Add event listeners
    gameSettings.addEventListener(CustomEventType.GameSettingsChange, this.onSettingsChange);
    // this.#players = gameSettings.data;
    // this.paddles = [];
    // this.balls = [];
    // this.score = [];

    // Initialize game
    this.initializeGame(gameSettings.data);
  }

  // The async-ness and the loading dialog are a joke, btw
  async initializeGame(players: PlayerForm[]) {
    this.#loadingDialog.show();
    this.#gameState = GameState.Initializing;
    this.#winner = null;
    this.#players = players;
    this.#scoreboard.setScores(players);
    this.createPaddles();
    this.createBalls();
    this.#confetti.stop();

    window.setTimeout(() => {
      this.#gameState = GameState.Ready;
      this.#loadingDialog.close();
      this.start();
    }, 1000);
  }

  async onSettingsChange(event: Event) {
    if (isGameSettingsChangeEvent(event)) {
      this.initializeGame(event.detail);
    }
  }

  handlePlayerSettingsChanged() {
    // stop game
    // update this.players
  }

  createPaddles() {
    const playerCount = this.#players.length;
    const paddles: Paddle[] = [];

    this.#paddles.forEach((paddle) => {
      paddle.remove();
    });

    for (let i = 0; i < maxPlayers; i++) {
      // Circle around players array when less than four players
      const playerIndex = ((i % playerCount) + playerCount) % playerCount;
      // playerIndex is NaN when players.length === 0
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
    const balls: Ball[] = [];

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

  checkCollision() {}
  handleCollision() {}

  checkGoal() {
    // ball out of bounds
  }
  updateScore() {
    //
  }
  handleWinner(player: PlayerForm) {
    this.#winner = player;
    this.#confetti.start();
    this.#gameState = GameState.Winner;
  }

  start() {
    requestAnimationFrame(this.update);
    // change game state
    // more?
  }

  stop() {
    // change game state
    // more?
  }

  update() {
    this.#context.clearRect(0, 0, canvasDimension, canvasDimension);
    if (this.#gameState === GameState.Initializing) {
      return;
    }
    if (this.#gameState === GameState.Ready) {
      // display Press Space To Start
      // listen for Press Space To Start
      // Add and remove event listeners on GameState.Ready change?
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
    if (this.#gameState === GameState.Winner) {
      // Display winner dialog and release confetti
      // Press Space To Play Again => No. Press Space To Continue => Reset game state and initialize
      // No dialog? Just text on screen. That way we can simply listen for gameSettingsChange event
    }
    if (this.#gameState === GameState.Running) {
      // update movement
      // check collisions
      // check goals
      // check winner
    }
    requestAnimationFrame(this.update);
  }
}

function checkCollision(a: Ball, b: Ball | Paddle) {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

function collides(a: Ball, b: Ball | Paddle) {
  if (checkCollision(a, b)) {
    // Will this prevent multiple collisions at once?
    a.colliding = true;
    b.colliding = true;

    // Distance between
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    // Solve collision
    a.x += dx;
    a.y += dy;

    // Change vectors
    const angle = Math.atan2(dy, dx);
    a.dx -= Math.cos(angle);
    a.dy -= Math.sin(angle);

    // if (b instanceof Ball) {
    //   b.dx += Math.cos(angle);
    //   b.dy += Math.sin(angle);
    // }
  }
}

// NEXT STEP
// Collision with paddle
// Rotate board on collision
// Play sound

// Then set scores when ball is out of bounds

// Then set winner
