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
import "./ButtonContainer.module.css";

/**
 * ButtonContainer component that handles game start and end actions.
 * @param {Object} props - Component props.
 * @param {Function} props.setCountdown - Function to set the countdown timer.
 * @param {Function} props.setGameSessionId - Function to set the game session ID.
 * @param {string} props.gameSessionId - The current game session ID.
 */
const ButtonContainer = ({ setCountdown, setGameSessionId, gameSessionId }) => {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartGame = () => {
    setCountdown(3);
    setTimeout(() => {
      stopTimeDisplay();
      resetTimeDisplay();
      resetScoreDisplay();
      resetLoopDisplay();
      resetHoleDisplay();
      createNewGameSession().then((gameSessionId) => {
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
    <div className="button-container">
      {isGameStarted ? (
        <button id="end-game-btn" onClick={handleEndGame}>
          End Game
        </button>
      ) : (
        <button id="start-game-btn" onClick={handleStartGame}>
          Start Game
        </button>
      )}
    </div>
  );
};

export default ButtonContainer;
