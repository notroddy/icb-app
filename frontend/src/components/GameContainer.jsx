import React, { useState, useEffect } from 'react';
import ScoreContainer from './ScoreContainer';
import ButtonContainer from './ButtonContainer';
import './styles/GameContainer.css';

/**
 * GameContainer component that includes ScoreContainer and ButtonContainer.
 */
const GameContainer = () => {
    const [countdown, setCountdown] = useState(null);
    const [gameSessionId, setGameSessionId] = useState(null);

    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <div className="game-container">
            {countdown !== null && countdown > 0 && (
                <div className="countdown-overlay">
                    <div className="countdown">{countdown}</div>
                </div>
            )}
            <ScoreContainer inputsDisabled={countdown !== null && countdown > 0} gameSessionId={gameSessionId} />
            <ButtonContainer setCountdown={setCountdown} setGameSessionId={setGameSessionId} gameSessionId={gameSessionId} />
        </div>
    );
};

export default GameContainer;