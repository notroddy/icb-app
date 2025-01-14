import React from 'react';
import styles from './CountdownOverlay.module.css';

const CountdownOverlay = ({ countdown }) => (
    <div className={styles["countdown-overlay"]}>
        <div className={styles["countdown"]}>{countdown}</div>
    </div>
);

export default CountdownOverlay;
