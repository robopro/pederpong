import { Position } from "../types";
import {
  defaultPaddleLength,
  defaultPaddleDepth,
  canvasDimension,
  gridSize,
  defaultPaddleSpeed,
} from "../utils";
import { Player } from "./Player";

export class Paddle {
  static #lastId: number = 0;
  static generateId() {
    this.#lastId += 1;
    return this.#lastId;
  }

  #id: number;
  #player: Player;
  position: Position;
  width: number;
  height: number;
  x: number;
  y: number;
  dx = 0;
  dy = 0;
  vx: number;
  vy: number;
  colliding: boolean = false;

  constructor(player: Player, position: Position) {
    this.#id = Paddle.generateId();
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

  private onKeyDown = (event: KeyboardEvent) => {
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

  private onKeyUp = (event: KeyboardEvent) => {
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

  draw = (context: CanvasRenderingContext2D) => {
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
}
