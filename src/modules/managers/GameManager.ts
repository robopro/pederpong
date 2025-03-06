import { GameSettings } from "../components/GameSettings";
import { ScoreboardContainer } from "../components/ScoreboardContainer";
import {
  CustomEventType,
  GameState,
  isGameSettingsChangeEvent,
  Position,
  positions,
} from "../types";
import { LoadingDialog } from "../components/LoadingDialog";
import { Confetti } from "../components/Confetti";
import {
  canvasDimension,
  maxPlayers,
  createDefaultPlayer,
  isCollision,
  solveBallBallCollision,
  solveBallPaddleCollision,
  winningScore,
  getRandomNumber,
  startGameKey,
  frameRate,
} from "../utils";
import { Player } from "../classes/Player";
import { Paddle } from "../classes/Paddle";
import { Ball } from "../classes/Ball";
import { PlayerScoreboard } from "../components/PlayerScoreboard";

interface GameManagerProps {
  gameSettings: GameSettings;
  scoreboardContainer: ScoreboardContainer;
  loadingDialog: LoadingDialog;
  confetti: Confetti;
  canvas: HTMLCanvasElement;
}

export class GameManager {
  #gameSettings: GameSettings;
  #scoreboardContainer: ScoreboardContainer;
  #playerScoreboards: PlayerScoreboard[] = [];
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #loadingDialog: LoadingDialog;
  #confetti: Confetti;

  #gameState = GameState.Initializing;
  #winners: Player[] = [];
  #players: Player[] = [];
  #paddles: Paddle[] = [];
  #balls: Ball[] = [];
  #lastRenderTime = Date.now();

  constructor({
    gameSettings,
    scoreboardContainer,
    loadingDialog,
    confetti,
    canvas,
  }: GameManagerProps) {
    // Initialize properties
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

    // Add event listeners
    this.#gameSettings.addEventListener(CustomEventType.GameSettingsChange, this.onSettingsChange);
  }

  private onSettingsChange = (event: Event) => {
    if (isGameSettingsChangeEvent(event)) {
      this.initializeGame();
    }
  };

  // Call this method to start the game!
  // The async-ness is a joke, btw
  initializeGame = async () => {
    document.removeEventListener("keyup", this.setGameStateRunning);
    document.removeEventListener("keyup", this.restart);
    this.#gameState = GameState.Initializing;
    this.#loadingDialog.show();
    this.#confetti.stop();
    Ball.usedStartingPositions = new Set();
    this.#winners = [];

    this.resetCanvasRotation();
    this.createPlayers();
    this.createPlayerScoreboards();
    this.createPaddles();
    this.createBalls();
    // This is also a joke
    this.loading();
  };

  private loading = () => {
    window.setTimeout(() => {
      this.setGameStateReady();
      this.#loadingDialog.close();
      this.start();
    }, 1000);
  };

  private createPlayers = () => {
    this.#players = [];

    const playerFormData = this.#gameSettings.playerForms.map((playerForm) =>
      playerForm.getFormData(),
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

  private createPlayerScoreboards = () => {
    this.#scoreboardContainer.removePlayerScoreboards();
    this.#playerScoreboards = [];

    for (const player of this.#players) {
      const playerScoreboard = new PlayerScoreboard({
        playerId: player.id.toLocaleString(),
        name: player.name,
        color: player.color,
        score: player.score.toLocaleString(),
      });
      this.#scoreboardContainer.addPlayerScoreboard(playerScoreboard);
      this.#playerScoreboards.push(playerScoreboard);
    }
  };

  private updatePlayerScoreboards = () => {
    for (const playerScoreboard of this.#playerScoreboards) {
      const player = this.#players.find(
        (player) => player.id.toLocaleString() === playerScoreboard.playerid,
      );
      if (player) {
        playerScoreboard.setPlayerScoreboardData({ score: player.score.toLocaleString() });
      }
    }
  };

  private createPaddles = () => {
    this.#paddles.forEach((paddle) => {
      paddle.delete();
    });
    this.#paddles = [];

    const playerCount = this.#players.length > maxPlayers ? maxPlayers : this.#players.length;

    for (let i = 0; i < maxPlayers; i++) {
      // Circle around players array when less than four players
      const playerIndex = ((i % playerCount) + playerCount) % playerCount;
      // playerIndex is NaN when players.length === 0
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

  private createBalls = () => {
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

  private setGameStateReady = () => {
    document.addEventListener("keyup", this.setGameStateRunning);
    this.#gameState = GameState.Ready;
  };

  private setGameStateRunning = (event: KeyboardEvent) => {
    if (event.key === startGameKey) {
      document.removeEventListener("keyup", this.setGameStateRunning);
      this.#gameState = GameState.Running;
    }
  };

  private setGameStateWinner = () => {
    this.#confetti.start();
    this.#gameState = GameState.Winner;
    document.addEventListener("keyup", this.restart);
  };

  private move = () => {
    this.#paddles.forEach((paddle) => {
      paddle.move();
    });

    this.#balls.forEach((ball) => {
      ball.move();
    });
  };

  private checkGoals = () => {
    for (const ball of this.#balls) {
      const goalPosition = ball.isOutOfBounds();
      if (goalPosition) {
        this.updatePlayerScores(ball, goalPosition);
        this.updatePlayerScoreboards();
        ball.reset();
      }
    }
  };

  private updatePlayerScores = (ball: Ball, goalPosition: Position) => {
    const paddle = this.#paddles.find((paddle) => paddle.position === goalPosition);
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

  private checkWinners = () => {
    for (const player of this.#players) {
      if (player.score >= winningScore) {
        this.#winners.push(player);
      }
    }
    if (this.#winners.length > 0) {
      this.setGameStateWinner();
    }
  };

  private checkCollision = () => {
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

  private resetCanvasRotation = () => {
    this.#canvas.style.transform = "rotate(0deg)";
  };

  private rotateCanvasRandomly = () => {
    const rotateAngle = `${getRandomNumber(-360, 360)}deg`;
    const rotate3dAngle = `${getRandomNumber(15, 45)}deg`;
    const { x, y, z } = { x: Math.random(), y: Math.random(), z: Math.random() };
    const transform = `rotate(${rotateAngle}) rotate3d(${x}, ${y}, ${z}, ${rotate3dAngle})`;
    this.#canvas.style.transform = transform;
  };

  private draw = () => {
    for (const paddle of this.#paddles) {
      paddle.draw(this.#context);
    }
    for (const ball of this.#balls) {
      ball.draw(this.#context);
    }
  };

  private start = () => {
    requestAnimationFrame(this.update);
  };

  private restart = (event: KeyboardEvent) => {
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

  private update = () => {
    const elapsed = Date.now() - this.#lastRenderTime;
    if (elapsed > frameRate) {
      this.#context.clearRect(0, 0, canvasDimension, canvasDimension);
      if (this.#gameState === GameState.Stopped) {
        return;
      }
      if (this.#gameState === GameState.Ready) {
        this.drawStartScreen();
      }
      if (this.#gameState === GameState.Winner) {
        this.drawWinners();
      }
      if (this.#gameState === GameState.Running) {
        this.move();
        this.checkGoals();
        this.checkWinners();
        this.checkCollision();
        this.draw();
      }
    }
    requestAnimationFrame(this.update);
  };

  private drawStartScreen = () => {
    const text = "Press SPACE to start";
    this.#context.fillStyle = Math.random() < 0.5 ? "white" : "transparent";
    this.#context.fillText(text, canvasDimension / 2, 100);
  };

  private drawWinners = () => {
    const textHeight = this.#context.measureText("M").width + 20;

    this.#winners.forEach((winner, index) => {
      const text = `${winner.name} wins!`;
      this.#context.fillStyle = winner.getColor();
      this.#context.fillText(text, canvasDimension / 2, 100 + textHeight * index);
    });
    const text = "Press SPACE to play again";
    this.#context.fillStyle = Math.random() < 0.5 ? "white" : "transparent";
    this.#context.fillText(
      text,
      canvasDimension / 2,
      100 + textHeight + textHeight * this.#winners.length,
    );
  };
}
