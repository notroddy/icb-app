import React, { useState, useEffect } from 'react';
import ScoreContainer from '../ScoreContainer/ScoreContainer';
import ButtonContainer from '../ButtonContainer/ButtonContainer';
import CountdownOverlay from '../CountdownOverlay/CountdownOverlay';
import styles from './GameContainer.module.css';

/**
 * GameContainer component that includes ScoreContainer and ButtonContainer.
 * @param {Object} props - Component props.
 * @param {string} props.userId - The selected user ID.
 * @param {string} props.gameId - The selected game ID.
 * @param {string} props.arcadeId - The selected arcade ID.
 */
const GameContainer = ({ userId, gameId, arcadeId }) => {
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
            <ButtonContainer setCountdown={setCountdown} setGameSessionId={setGameSessionId} gameSessionId={gameSessionId} userId={userId} gameId={gameId} arcadeId={arcadeId} />
        </div>
    );
};

export default GameContainer;