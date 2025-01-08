import React, { useState } from 'react';
import { updateGameSession, addHoleScore } from '../utils/api';
import './styles/ScoreContainer.css';
const ScoreContainer = () => {
    const [score, setScore] = useState(0);
    const [loopScore, setLoopScore] = useState(0);
    const [holeNumber, setHoleNumber] = useState(1);
    const [loopNumber, setLoopNumber] = useState(1);
    const [time,  setTime] = useState('00:00:00');

    const handleHoleScoreInput = (e) => {
        if (e.key === 'Enter') {
            const holeScore = parseInt(e.target.value, 10);
            if (!isNaN(holeScore)) {
                const newLoopScore = loopScore + holeScore;
                setLoopScore(newLoopScore);
                updateGameSession(holeNumber, loopNumber, holeScore);
                addHoleScore(holeNumber, holeScore);

                if (holeNumber === 10) {
                    setScore(score + newLoopScore);
                    setLoopScore(0);
                    setHoleNumber(1);
                    setLoopNumber(loopNumber + 1);
                } else {
                    setHoleNumber(holeNumber + 1);
                }
                e.target.value = '';
            }
        }
    };

    return (
        <div className="score-container">
            
            <div id="balls-display-container">
                <div id="balls-display">
                    <input type="number" id="balls-input" defaultValue="1" min="1" style={{ width: '50px' }} />
                </div>
                <div className="arrow"></div>
                <div id="ball-on-bar">
                    <div>BALL</div>
                    <div>ON</div>
                    <div>BAR</div>
                </div>
            </div>
            <div id="time-display">
                <div className="time-label">TIME</div>
                <div id="time-value">{time}</div>
            </div>
            <div id="hole-display-container">
                <div id="hole-number-display">
                    <div className="hole-label">HOLE</div>
                    <input type="number" id="hole-number-input" value={holeNumber} min="1" max="10" style={{ width: '50px' }} readOnly />
                </div>
                <div id="hole-score-display">
                    <div className="hole-label">HOLE SCORE</div>
                    <input type="number" id="hole-score-input" defaultValue="0" style={{ width: '75px' }} onKeyPress={handleHoleScoreInput} />
                </div>
            </div>
            <div id="hole-display-container">
                <div id="hole-number-display">
                    <div className="hole-label">LOOP</div>
                    <input type="number" id="loop-number-input" value={loopNumber} min="1" max="10" style={{ width: '50px' }} readOnly />
                </div>
                <div id="hole-score-display">
                    <div className="hole-label">LOOP SCORE</div>
                    <input type="number" id="loop-score-input" value={loopScore} style={{ width: '75px' }} readOnly />
                </div>
            </div>
            <div id="score-display">
                <div className="score-label">SCORE</div>
                <div id="score-value">{score}</div>
            </div>
        </div>
    );
};

export default ScoreContainer;
