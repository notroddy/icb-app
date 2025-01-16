import React from 'react';
import styles from './CountdownOverlay.module.css';

/**
 * CountdownOoverlay component that handles game start and end actions.
 * @param {string} countdown - Countdown timer.
 */
const CountdownOverlay = ({ countdown }) => (
    <div className={styles["countdown-overlay"]}>
        <div className={styles["countdown"]}>{countdown}</div>
    </div>
);

export default CountdownOverlay;
