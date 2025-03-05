import { Player, PlayerForm } from "./components/PlayerForm";
import { Color, Sound } from "./types";

// Game State
export const maxPlayers = 4;
export const canvasDimension = 800;
export const gridSize = 20;

// Paddle
export const defaultPaddleLength = gridSize * 4;
export const defaultPaddleDepth = gridSize;
export const defaultPaddleSpeed = 7;

// Ball
export const defaultBallSize = gridSize;
export const defaultBallSpeed = 2;
export const defaultBallPosition = canvasDimension / 2 - defaultBallSize / 2;

// CSS
export const swapColorKeyframes = `
  @keyframes color-swap {
    from { color: var(--player-color, black)};
    to { color: transparent};
  }
`;

export const swapColorAnimation = `
  animation-name: color-swap;
  animation-iteration-count: infinite;
  animation-duration: 150ms;
  animation-timing-function: ease-in;
`;

// Player Data
const defaultKeys = [
  ["w", "s"],
  ["r", "f"],
  ["y", "h"],
  ["i", "k"],
];

export const defaultPlayers: Player[] = [
  {
    id: "0",
    name: "John",
    color: Color.Blue,
    sound: Sound.Eagle,
    keyup: defaultKeys[0][0],
    keydown: defaultKeys[0][1],
  },
  {
    id: "1",
    name: "Jane",
    color: Color.Green,
    sound: Sound.Goat,
    keyup: defaultKeys[1][0],
    keydown: defaultKeys[1][1],
  },
  {
    id: "2",
    name: "Jahn",
    color: Color.Red,
    sound: Sound.Monster,
    keyup: defaultKeys[2][0],
    keydown: defaultKeys[2][1],
  },
  {
    id: "3",
    name: "Jone",
    color: Color.Yellow,
    sound: Sound.TRex,
    keyup: defaultKeys[3][0],
    keydown: defaultKeys[3][1],
  },
];

export const createDefaultPlayer = (index: number) => {
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

// Utils
export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(getRandomNumber(min, max));
};
