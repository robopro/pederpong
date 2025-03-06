import { GameSettings } from "./modules/components/GameSettings";
import { Confetti } from "./modules/components/Confetti";
import { LoadingDialog } from "./modules/components/LoadingDialog";
import { GameManager } from "./modules/managers/GameManager";
import { ScoreboardContainer } from "./modules/components/ScoreboardContainer";
import { canvasDimension } from "./modules/utils";

const initApp = () => {
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
              canvas,
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
