import React, { useState } from 'react';
import { createNewGameSession, resetTimeDisplay, resetScoreDisplay, startStopwatch, stopTimeDisplay, resetLoopDisplay } from '../utils/api';
import './styles/ButtonContainer.css';

const ButtonContainer = ({ setCountdown }) => {
    const [isGameStarted, setIsGameStarted] = useState(false);

    const handleStartGame = () => {
        setCountdown(3); // Start the countdown
        setTimeout(() => {
            stopTimeDisplay();
            resetTimeDisplay();
            resetScoreDisplay();
            resetLoopDisplay();
            createNewGameSession();
            startStopwatch();
            setIsGameStarted(true);
        }, 3000); // Delay the start game functions by 3 seconds
    };

    const handleEndGame = () => {
        stopTimeDisplay();
        resetTimeDisplay();
        resetScoreDisplay();
        resetLoopDisplay();
        setIsGameStarted(false);
    };

    return (
        <div className="button-container">
            {isGameStarted ? (
                <button id="end-game-btn" onClick={handleEndGame}>End Game</button>
            ) : (
                <button id="start-game-btn" onClick={handleStartGame}>Start Game</button>
            )}
        </div>
    );
};

export default ButtonContainer;
