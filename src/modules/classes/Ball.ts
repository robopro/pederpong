import { Position } from "../types";
import {
  defaultBallSize,
  defaultBallSpeed,
  defaultBallPointValue,
  getStartingPosition,
  getRandomNumber,
  canvasDimension,
} from "../utils";
import { Player } from "./Player";

export class Ball {
  static #lastId: number = 0;
  static generateId() {
    this.#lastId += 1;
    return this.#lastId;
  }
  static usedStartingPositions: Set<Position> = new Set();

  #id: number;
  #player: Player;
  #avatar: HTMLImageElement;
  #startingX: number;
  #startingY: number;
  #canCollide = false;
  width = defaultBallSize;
  height = defaultBallSize;
  x: number;
  y: number;
  dx = 0;
  dy = 0;
  pointValue: number = defaultBallPointValue;

  constructor(player: Player) {
    this.#id = Ball.generateId();
    this.#player = player;

    const { x, y } = getStartingPosition(Ball.usedStartingPositions, this.width, this.height);
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
    }, 1000);
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

  draw = (context: CanvasRenderingContext2D) => {
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
}
