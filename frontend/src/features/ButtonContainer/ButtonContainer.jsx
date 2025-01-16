import React, { useState } from "react";
import {
  createNewGameSession,
  resetTimeDisplay,
  resetScoreDisplay,
  startStopwatch,
  stopTimeDisplay,
  resetLoopDisplay,
  resetHoleDisplay,
  endGameSession,
} from "../../utils/api";
import styles from "./ButtonContainer.module.css";

/**
 * ButtonContainer component that handles game start and end actions.
 * @param {Object} props - Component props.
 * @param {Function} props.setCountdown - Function to set the countdown timer.
 * @param {Function} props.setGameSessionId - Function to set the game session ID.
 * @param {string} props.gameSessionId - The current game session ID.
 * @param {string} props.userId - The selected user ID.
 * @param {string} props.gameId - The selected game ID.
 * @param {string} props.arcadeId - The selected arcade ID.
 */
const ButtonContainer = ({ setCountdown, setGameSessionId, gameSessionId, userId, gameId, arcadeId }) => {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartGame = () => {
    setCountdown(3);
    setTimeout(() => {
      stopTimeDisplay();
      resetTimeDisplay();
      resetScoreDisplay();
      resetLoopDisplay();
      resetHoleDisplay();
      createNewGameSession(userId,gameId,arcadeId).then((gameSessionId) => {
        setGameSessionId(gameSessionId);
        startStopwatch();
        setIsGameStarted(true);
      });
    }, 3000);
  };

  const handleEndGame = () => {
    stopTimeDisplay();
    resetTimeDisplay();
    resetScoreDisplay();
    resetLoopDisplay();
    if (gameSessionId) {
      endGameSession(gameSessionId)
        .then(() => {
          console.log("Game session ended successfully");
        })
        .catch((error) => {
          console.error("Failed to end game session", error);
        });
    }
    setIsGameStarted(false);
  };

  return (
    <div className={styles["button-container"]}>
      {isGameStarted ? (
        <button
          id="end-game-btn"
          className={styles["end-game-btn"]}
          onClick={handleEndGame}
        >
          End Game
        </button>
      ) : (
        <button
          id="start-game-btn"
          className={styles["start-game-btn"]}
          onClick={handleStartGame}
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export default ButtonContainer;
