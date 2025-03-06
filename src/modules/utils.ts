import { Ball } from "./classes/Ball";
import { Paddle } from "./classes/Paddle";
import { Player } from "./classes/Player";
import { Color, Position, positions, PlayerFormData, Sound } from "./types";

// Globals
export const confettiColors = ["#ff6347", "#ffa500", "#32cd32", "#1e90ff", "#ff69b4"] as const;
export const baseAudioUrl = "src/audio/";
export const avatarUrl = "src/images/avatar.png";
export const frameRate = 1000 / 10;

// Game State
export const maxPlayers = 4;
export const canvasDimension = 800;
export const gridSize = 20;
export const winningScore = 9;
export const startGameKey = " ";

// Paddle
export const defaultPaddleLength = gridSize * 4;
export const defaultPaddleDepth = gridSize;
export const defaultPaddleSpeed = 7;

// Ball
export const defaultBallSize = gridSize;
export const defaultBallSpeed = 2;
export const defaultBallPosition = canvasDimension / 2 - defaultBallSize / 2;
export const defaultBallPointValue = 1;

// Player
const defaultKeys = [
  ["w", "s"],
  ["r", "f"],
  ["y", "h"],
  ["i", "k"],
  ["o", "l"],
] as const;

export const defaultPlayerFormData = [
  {
    name: "John",
    color: Color.Blue,
    sound: Sound.Eagle,
    keyup: defaultKeys[0][0],
    keydown: defaultKeys[0][1],
  },
  {
    name: "Jane",
    color: Color.Green,
    sound: Sound.Goat,
    keyup: defaultKeys[1][0],
    keydown: defaultKeys[1][1],
  },
  {
    name: "Jone",
    color: Color.Red,
    sound: Sound.Monster,
    keyup: defaultKeys[2][0],
    keydown: defaultKeys[2][1],
  },
  {
    name: "Jahn",
    color: Color.Yellow,
    sound: Sound.TRex,
    keyup: defaultKeys[3][0],
    keydown: defaultKeys[3][1],
  },
  {
    name: "Smith",
    color: Color.Yellow,
    sound: Sound.TRex,
    keyup: defaultKeys[4][0],
    keydown: defaultKeys[4][1],
  },
] as const;

export const createDefaultPlayer = (index: number) => {
  const playerFormData = defaultPlayerFormData[index]
    ? defaultPlayerFormData[index]
    : defaultPlayerFormData[0];
  const newPlayerFormData: PlayerFormData = { ...playerFormData };
  newPlayerFormData.keyup = undefined;
  newPlayerFormData.keydown = undefined;

  const player = new Player(newPlayerFormData);
  return player;
};

// Ball utils
export const getStartingPosition = (
  usedPositions: Set<Position>,
  width: number,
  height: number,
) => {
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

// Collision utils
export const isCollision = (a: Ball, b: Ball | Paddle) => {
  if (!a.canCollide) {
    return false;
  }
  if (b instanceof Ball && !b.canCollide) {
    return false;
  }
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
};

export const solveBallBallCollision = (a: Ball, b: Ball) => {
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

export const solveBallPaddleCollision = (ball: Ball, paddle: Paddle) => {
  const paddleCenter = { x: paddle.x + paddle.width / 2, y: paddle.y + paddle.height / 2 };
  const distanceFromCenter = { x: paddleCenter.x - ball.x, y: paddleCenter.y - ball.y };

  if ((paddle.position === "top" && ball.dy < 0) || (paddle.position === "bottom" && ball.dy > 0)) {
    ball.dx += distanceFromCenter.x * -0.1;
    ball.dy *= -1;
  } else if (
    (paddle.position === "right" && ball.dx > 0) ||
    (paddle.position === "left" && ball.dx < 0)
  ) {
    ball.dx *= -1;
    ball.dy += distanceFromCenter.y * -0.1;
  }
};

// Various Utils
export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(getRandomNumber(min, max));
};
