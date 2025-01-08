import React, { useState, useEffect } from 'react';
import ScoreContainer from './ScoreContainer';
import ButtonContainer from './ButtonContainer';
import './styles/GameContainer.css';

const GameContainer = () => {
    const [countdown, setCountdown] = useState(null);

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
            <ScoreContainer />
            <ButtonContainer setCountdown={setCountdown} />
        </div>
    );
};

export default GameContainer;