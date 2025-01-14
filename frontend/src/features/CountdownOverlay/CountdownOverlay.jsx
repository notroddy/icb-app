import React from 'react';
import './CountdownOverlay.module.css';

const CountdownOverlay = ({ countdown }) => (
    <div className="countdown-overlay">
        <div className="countdown">{countdown}</div>
    </div>
);

export default CountdownOverlay;
