import { CustomEventType, isGameSettingsChangeEvent } from "./modules/types";
import { GameSettings } from "./modules/components/GameSettings";
import { Confetti } from "./modules/components/Confetti";
import { LoadingDialog } from "./modules/components/LoadingDialog";
import { PlayerScore } from "./modules/components/PlayerScore";
import { Player } from "./modules/components/PlayerForm";
import { GameManager } from "./modules/managers/GameManager";
import { Scoreboard } from "./modules/components/Scoreboard";
import { canvasDimension } from "./modules/variables";
// import { SelectComponent } from "./modules/components/SelectComponent.js";
// Globals
// const bodyElement = document.querySelector("body");
// const scoreboard = document.getElementById("scoreboard");
// const canvas = document.getElementById("game");
// const context = canvas.getContext("2d");
// const grid = 15;
// const ballSize = grid * 4;
// const paddleDepth = grid;
// const paddleLength = grid * 5; // 80
// const maxPaddleY = canvas.height - grid - paddleLength;
// const maxPaddleX = canvas.width - grid - paddleLength;
// const paddleSpeed = 14;
// const ballSpeed = 6;
// let rotation = 0;
// const rotationIncremet = 45;
// const winningScore = 4;
// const losingScore = -4;
// let gameOver = false;

// const PaddlePositions = {
//   Top: 0,
//   Bottom: 1,
//   Left: 2,
//   Right: 3,
// };

// const PlayerNames = {
//   One: 0,
//   Two: 1,
// };

// // Game Objects
// function Paddle(player, position = 0, keys) {
//   this.player = player;
//   this.position = position;
//   this.keys = keys;
//   this.speed = paddleSpeed;
//   this.dx = 0;
//   this.dy = 0;

//   this.init = function () {
//     switch (this.position) {
//       case PaddlePositions.Top: {
//         this.x = canvas.width / 2 - paddleLength / 2;
//         this.y = paddleDepth + grid;
//         this.width = paddleLength;
//         this.height = paddleDepth;

//         document.addEventListener("keydown", (event) => {
//           const { key } = event;
//           if (key === this.keys[0]) {
//             this.dx = this.speed;
//           } else if (key === this.keys[1]) {
//             this.dx = -this.speed;
//           }
//         });

//         document.addEventListener("keyup", (event) => {
//           const { key } = event;
//           if (key === this.keys[0] || key === this.keys[1]) {
//             this.dx = 0;
//           }
//         });
//         break;
//       }
//       case PaddlePositions.Left: {
//         this.x = paddleDepth + grid;
//         this.y = canvas.height / 2 - paddleLength / 2;
//         this.width = paddleDepth;
//         this.height = paddleLength;

//         document.addEventListener("keydown", (event) => {
//           const { key } = event;
//           if (key === this.keys[0]) {
//             this.dy = this.speed;
//           } else if (key === this.keys[1]) {
//             this.dy = -this.speed;
//           }
//         });

//         document.addEventListener("keyup", (event) => {
//           const { key } = event;
//           if (key === this.keys[0] || key === this.keys[1]) {
//             this.dy = 0;
//           }
//         });
//         break;
//       }
//       case PaddlePositions.Bottom: {
//         this.x = canvas.width / 2 - paddleLength / 2;
//         this.y = canvas.height - paddleDepth - grid * 2;
//         this.width = paddleLength;
//         this.height = paddleDepth;

//         document.addEventListener("keydown", (event) => {
//           const { key } = event;
//           if (key === this.keys[0]) {
//             this.dx = this.speed;
//           } else if (key === this.keys[1]) {
//             this.dx = -this.speed;
//           }
//         });

//         document.addEventListener("keyup", (event) => {
//           const { key } = event;
//           if (key === this.keys[0] || key === this.keys[1]) {
//             this.dx = 0;
//           }
//         });
//         break;
//       }
//       case PaddlePositions.Right: {
//         this.x = canvas.width - paddleDepth - grid * 2;
//         this.y = canvas.height / 2 - paddleLength / 2;
//         this.width = paddleDepth;
//         this.height = paddleLength;

//         document.addEventListener("keydown", (event) => {
//           const { key } = event;
//           if (key === this.keys[0]) {
//             this.dy = this.speed;
//           } else if (key === this.keys[1]) {
//             this.dy = -this.speed;
//           }
//         });

//         document.addEventListener("keyup", (event) => {
//           const { key } = event;
//           if (key === this.keys[0] || key === this.keys[1]) {
//             this.dy = 0;
//           }
//         });
//         break;
//       }
//     }
//   };
//   this.init();

//   this.move = function () {
//     this.x += this.dx;
//     this.y += this.dy;

//     if (
//       this.position === PaddlePositions.Left ||
//       this.position === PaddlePositions.Right
//     ) {
//       if (this.y < grid) {
//         this.y = grid;
//       } else if (this.y > maxPaddleY) {
//         this.y = maxPaddleY;
//       }
//     } else {
//       if (this.x < grid) {
//         this.x = grid;
//       } else if (this.x > maxPaddleX) {
//         this.x = maxPaddleX;
//       }
//     }
//   };

//   this.draw = function () {
//     context.fillStyle = this.player.color();
//     context.fillRect(this.x, this.y, this.width, this.height);
//   };
// }

// function Ball(player) {
//   this.player = player;
//   this.height = ballSize;
//   this.width = ballSize;
//   this.speed = ballSpeed;
//   this.resetting = false;

//   this.resetSpeed = function () {
//     const [dx, dy] = randomNumbersWithFixedSum(this.speed);
//     const xDirection = Math.random() < 0.5 ? -1 : 1;
//     const yDirection = Math.random() < 0.5 ? -1 : 1;
//     this.dx = dx * xDirection;
//     this.dy = dy * yDirection;
//   };

//   this.resetPosition = function () {
//     this.x = canvas.width / 2;
//     this.y = canvas.height / 2;
//   };

//   this.init = function () {
//     this.resetPosition();
//     this.resetSpeed();
//   };
//   this.init();

//   this.reset = function () {
//     this.resetting = false;
//     this.resetPosition();
//     this.resetSpeed();
//   };

//   this.outOfBounds = function () {
//     if (
//       (this.x < 0 ||
//         this.x > canvas.width ||
//         this.y < 0 ||
//         this.y > canvas.height) &&
//       !this.resetting
//     ) {
//       this.resetting = true;

//       if (this.y < 0) {
//         if (this.player.positions.includes(PaddlePositions.Top)) {
//           this.player.scoreSelfGoal();
//         } else {
//           this.player.scoreGoal();
//         }
//       } else if (this.x < 0) {
//         if (this.player.positions.includes(PaddlePositions.Left)) {
//           this.player.scoreSelfGoal();
//         } else {
//           this.player.scoreGoal();
//         }
//       } else if (this.y > canvas.height) {
//         if (this.player.positions.includes(PaddlePositions.Bottom)) {
//           this.player.scoreSelfGoal();
//         } else {
//           this.player.scoreGoal();
//         }
//       } else if (this.x > canvas.width) {
//         if (this.player.positions.includes(PaddlePositions.Right)) {
//           this.player.scoreSelfGoal();
//         } else {
//           this.player.scoreGoal();
//         }
//       }

//       // give some time for the player to recover before launching the ball again
//       setTimeout(() => {
//         this.reset();
//       }, 400);
//     }
//   };

//   this.move = function () {
//     this.x += this.dx * (Math.random() * 2);
//     this.y += this.dy * (Math.random() * 2);
//   };

//   this.draw = function () {
//     context.fillStyle = this.player.color();
//     context.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
//     context.drawImage(
//       document.getElementById("peder"),
//       this.x,
//       this.y,
//       this.width,
//       this.height,
//     );
//   };
// }

// function Player(name, positions, keys, color, sound) {
//   this.name = name;
//   this.positions = positions;
//   this.keys = keys;
//   this.color = color;
//   this.sound = sound;
//   this.score = 0;

//   this.init = function () {
//     this.paddles = positions.map(
//       (position, index) => new Paddle(this, position, this.keys),
//     );
//     this.ball = new Ball(this);
//   };
//   this.init();

//   this.scoreGoal = function () {
//     this.score += 1;
//   };

//   this.scoreSelfGoal = function () {
//     this.score -= 1;
//   };

//   this.movePaddles = function () {
//     for (let paddle of this.paddles) {
//       paddle.move();
//     }
//   };

//   this.drawPaddles = function () {
//     for (let paddle of this.paddles) {
//       paddle.draw();
//     }
//   };

//   this.moveBall = function () {
//     this.ball.move();
//     this.ball.outOfBounds();
//   };

//   this.drawBall = function () {
//     this.ball.draw();
//   };
// }

// // Initialize Game

// const soundPlayerOne = document.querySelector("#audio");
// const soundPlayerTwo = document.querySelector("#audio2");
// const colorPlayerOne = () => (Math.random() < 0.5 ? "red" : "blue");
// const colorPlayerTwo = () => (Math.random() < 0.5 ? "green" : "yellow");

// const players = [
//   new Player(
//     PlayerNames.One,
//     [PaddlePositions.Top, PaddlePositions.Left],
//     ["ArrowUp", "ArrowDown"],
//     colorPlayerOne,
//     soundPlayerOne,
//   ),
//   new Player(
//     PlayerNames.Two,
//     [PaddlePositions.Bottom, PaddlePositions.Right],
//     ["w", "s"],
//     colorPlayerTwo,
//     soundPlayerTwo,
//   ),
// ];
// const paddles = players.flatMap((player) => player.paddles);
// const balls = players.map((player) => player.ball);

// const scores = players.reduce((acc, player, index) => {
//   const span = document.createElement("span");
//   span.id = player.name;
//   span.innerHTML = player.score;
//   span.setAttribute("style", `color: ${player.color()}`);
//   acc.push(span);
//   if (index < players.length - 1) {
//     acc.push(":");
//   }
//   return acc;
// }, []);

// scoreboard.append(...scores);

// // Utils
// // check for collision between two objects using axis-aligned bounding box (AABB)
// // @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
// function collides(obj1, obj2) {
//   return (
//     obj1.x < obj2.x + obj2.width &&
//     obj1.x + obj1.width > obj2.x &&
//     obj1.y < obj2.y + obj2.height &&
//     obj1.y + obj1.height > obj2.y
//   );
// }

// function rotateAndPlaySound(player, degrees) {
//   rotation += rotationIncremet;
//   bodyElement.style.transform = `rotate(${rotation}deg) rotate3d(1, 1, 1, ${degrees}deg)`;
//   player.sound.currentTime = 0;
//   player.sound.play();
// }

// function handlePaddleCollision(player, balls) {
//   for (let paddle of player.paddles) {
//     for (let ball of balls) {
//       if (collides(ball, paddle)) {
//         switch (paddle.position) {
//           case PaddlePositions.Top: {
//             ball.dy *= -1;
//             ball.y = paddle.y + paddle.height;
//             rotateAndPlaySound(player, 15);
//             break;
//           }
//           case PaddlePositions.Left: {
//             ball.dx *= -1;
//             ball.x = paddle.x + paddle.width;
//             rotateAndPlaySound(player, 45);
//             // rotation += 45;
//             // bodyElement.style.transform = "rotate(" +  rotation + "deg) rotate3d(1, 1, 1, 45deg)";
//             break;
//           }
//           case PaddlePositions.Bottom: {
//             ball.dy *= -1;
//             ball.y = paddle.y - ball.height;
//             rotateAndPlaySound(player, 45);
//             // rotation += 45;
//             // bodyElement.style.transform = "rotate(" +  rotation + "deg) rotate3d(1, 1, 1, 45deg)";
//             break;
//           }
//           case PaddlePositions.Right: {
//             ball.dx *= -1;
//             ball.x = paddle.x - ball.width;
//             rotateAndPlaySound(player, 15);
//             // rotation += 45;
//             // bodyElement.style.transform = "rotate(" +  rotation + "deg) rotate3d(1, 1, 1, 15deg)";
//             break;
//           }
//           default:
//             break;
//         }
//       }
//     }
//   }
// }

// function randomNumbersWithFixedSum(sum) {
//   const min = 1;
//   const max = sum;

//   const first = Math.floor(Math.random() * (max - min)) + min;
//   const second = sum - first;

//   return [first, second];
// }

// // Game Loop
// function loop() {
//   if (gameOver) {
//     return;
//   }
//   requestAnimationFrame(loop);
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   for (let player of players) {
//     const scoreSpan = document.getElementById(player.name);
//     scoreSpan.setAttribute("style", `color: ${player.color()}`);

//     if (player.score > winningScore || player.score < losingScore) {
//       const wonOrLost = player.score > winningScore ? "wins" : "lost";
//       const text = `Player ${player.name} ${wonOrLost}!`;
//       const textWidth = context.measureText(text).width;
//       context.font = "xxx-large monospace";
//       context.fillStyle = player.color();
//       context.fillText(
//         text,
//         canvas.width / 2 - textWidth / 2,
//         canvas.height / 2,
//       );
//       gameOver = true;
//       return;
//     }

//     player.movePaddles();
//     player.moveBall();
//     handlePaddleCollision(player, balls);
//     const score = document.getElementById(player.name);
//     score.innerHTML = player.score;
//     player.drawPaddles();
//     player.drawBall();
//   }
// }

// // start the game
// requestAnimationFrame(loop);

const initApp = () => {
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
                context,
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

      // TODO
      // document.querySelector("body")?.appendChild(confettiElement);
      // if (confettiElement instanceof Confetti) {
      //   window.setTimeout(() => {
      //     confettiElement.start();
      //   }, 2000);

      //   window.setTimeout(() => {
      //     confettiElement.stop();
      //   }, 9000);
      // }

      // document.querySelector("body")?.appendChild(loadingDialog);
      // if (loadingDialog instanceof LoadingDialog) {
      //   loadingDialog.show();

      //   window.setTimeout(() => {
      //     loadingDialog.close();
      //   }, 1000);
      // }

      // const gameManager = new GameManager({settingsElement, scoresElement});
      // build HTML:
      // settings
      // score heading
      // score container
      //  scores
      // confetti
      // loading

      // create game manager
      // assign various parts to game manager
      // game manager handles event listeners
    } else {
      throw new Error("initApp: gameSettings not instance of GameSettings");
    }
  } else {
    throw new Error("initApp: Couldn't find root");
  }
};

initApp();

// function setPlayerScoreAttributes(playerScore: PlayerScore, player: Player) {
//   playerScore.setAttribute("id", player.id);
//   playerScore.setAttribute("name", player.name);
//   playerScore.setAttribute("score", player.score);
//   playerScore.setAttribute("color", player.color);
// }

// function createPlayerScore(player: Player) {
//   const scoreElement = document.createElement("player-score");
//   if (scoreElement instanceof PlayerScore) {
//     setPlayerScoreAttributes(scoreElement, player);
//     return scoreElement;
//   }
//   return;
// }

// function createPlayerScores(players: Player[], parent: HTMLElement) {
//   for (const player of players) {
//     const playerScore = createPlayerScore(player);
//     if (playerScore) {
//       parent.appendChild(playerScore);
//     }
//   }
// }

// TODO:
// Create new GameManager object
//  GM listens to PlayerSettings
//  GM creates new Player objects based on data in PlayerSettings
//    Does GM keep track of balls? Yes. GM, not Player
//  GM creates Ball objects based on data in PlayerSettings
//  GM keeps track of score => Score object?
//  GM deals with canvas

// Player
//  id, name, color, sound
//  paddles
//  key inputs?

// Ball
//  playerId
