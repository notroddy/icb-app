import React, { useState, useEffect } from 'react';
import ScoreContainer from '../ScoreContainer/ScoreContainer';
import ButtonContainer from '../ButtonContainer/ButtonContainer';
import CountdownOverlay from '../CountdownOverlay/CountdownOverlay';
import styles from './GameContainer.module.css';

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
        <div className={styles["game-container"]}>
            {countdown !== null && countdown > 0 && (
                <CountdownOverlay countdown={countdown} />
            )}
            <ScoreContainer inputsDisabled={countdown !== null && countdown > 0} gameSessionId={gameSessionId} />
            <ButtonContainer setCountdown={setCountdown} setGameSessionId={setGameSessionId} gameSessionId={gameSessionId} />
        </div>
    );
};

export default GameContainer;