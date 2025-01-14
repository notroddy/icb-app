import React, { useState, useEffect } from "react";
import { updateGameSession, addHoleScore, completeLoop } from "../utils/api";
import "./styles/ScoreContainer.css";

const ScoreContainer = ({ inputsDisabled, gameSessionId }) => {
  const [score, setScore] = useState(0);
  const [loopScore, setLoopScore] = useState(0);
  const [holeNumber, setHoleNumber] = useState(1);
  const [loopNumber, setLoopNumber] = useState(1);
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    if (inputsDisabled) {
      setHoleNumber(1);
      setLoopNumber(1);
    }
  }, [inputsDisabled]);

  const handleHoleScoreInput = (e) => {
    if (e.key === "Enter" && gameSessionId) {
      const holeScore = parseInt(e.target.value, 10);
      if (!isNaN(holeScore)) {
        const newLoopScore = loopScore + holeScore;
        setLoopScore(newLoopScore);
        updateGameSession(loopNumber, holeNumber, holeScore);
        addHoleScore(holeNumber, holeScore);

        if (holeNumber === 10) {
          setScore(score + newLoopScore);
          setLoopScore(0);
          setHoleNumber(1);
          setLoopNumber(loopNumber + 1);
          completeLoop(gameSessionId, loopNumber);
        } else {
          setHoleNumber(holeNumber + 1);
        }
        e.target.value = "";
      }
    }
  };

  return (
    <div className="score-container">
      <div id="balls-display-container" className="display-container centered">
        <div className="balls-display">
          <input
            type="number"
            className="balls-input"
            defaultValue="1"
            min="1"
            disabled={inputsDisabled}
          />
        </div>
        <div className="arrow"></div>
        <div className="ball-on-bar">
          <div>BALL</div>
          <div>ON</div>
          <div>BAR</div>
        </div>
      </div>
      <div id="time-display-container" className="display-container centered">
        <div className="time-display">
          <div id="time-label" className="display-label">
            TIME
          </div>
          <div id="time-value">{time}</div>
        </div>
      </div>

      <div id="hole-display-container" className="display-container centered">
        <div id="hole-number-display" className="number-display">
          <div className="display-label" id="hole-number-label">
            HOLE
          </div>
          <input
            type="number"
            className="number-input"
            value={holeNumber}
            min="1"
            max="10"
            readOnly
          />
        </div>

        <div id="hole-score-display" className="score-display">
          <div className="display-label" id="hole-score-label">
            HOLE SCORE
          </div>
          <input
            type="number"
            className="score-input"
            defaultValue="0"
            onKeyPress={handleHoleScoreInput}
            disabled={inputsDisabled}
          />
        </div>
      </div>
      <div id="loop-display-container" className="display-container centered">
        <div id="loop-number-display" className="number-display">
          <div className="display-label" id="loop-number-label">
            LOOP
          </div>
          <input
            type="number"
            className="number-input"
            value={loopNumber}
            min="1"
            max="10"
            readOnly
          />
        </div>
        <div id="loop-score-display" className="score-display">
          <div className="display-label" id="loop-score-label">
            LOOP SCORE
          </div>
          <input
            type="number"
            className="score-input centered"
            value={loopScore}
            readOnly
          />
        </div>
      </div>
      <div className="score-display centered">
        <div id="score-label" className="display-label">
          SCORE
        </div>
        <div className="score-value">{score}</div>
      </div>
    </div>
  );
};

export default ScoreContainer;
