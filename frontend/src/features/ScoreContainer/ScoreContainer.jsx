import React, { useState, useEffect } from "react";
import { updateGameSession, addHoleScore, completeLoop } from "../../utils/api";
import styles from "./ScoreContainer.module.css";

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
        if (holeScore === 0) {
          e.target.value = "";
          return;
        }
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
    <div className={styles["score-container"]}>
      <div id="balls-display-container" className={`${styles["display-container"]} ${styles["centered"]}`}>
        <div className={styles["balls-display"]}>
          <input
            type="number"
            className={styles["balls-input"]}
            defaultValue="1"
            min="1"
            disabled={inputsDisabled}
          />
        </div>
        <div className={styles["arrow"]}></div>
        <div className={styles["ball-on-bar"]}>
          <div>BALL</div>
          <div>ON</div>
          <div>BAR</div>
        </div>
      </div>
      <div id="time-display-container" className={`${styles["display-container"]} ${styles["centered"]}`}>
        <div className={styles["time-display"]}>
          <div id="time-label" className={styles["display-label"]}>
            TIME
          </div>
          <div id="time-value" className={styles["time-value"]}>{time}</div>
        </div>
      </div>

      <div id="hole-display-container" className={`${styles["display-container"]} ${styles["centered"]}`}>
        <div id="hole-number-display" className={styles["number-display"]}>
          <div className={styles["display-label"]} id="hole-number-label">
            HOLE
          </div>
          <input
            type="number"
            className={styles["number-input"]}
            id="hole-number-input"
            value={holeNumber}
            min="1"
            max="10"
            readOnly
          />
        </div>

        <div id="hole-score-display" className={styles["score-display"]}>
          <div className={styles["display-label"]} id="hole-score-label">
            HOLE SCORE
          </div>
          <input
            type="text"
            className={styles["score-input"]}
            id="hole-score-input"
            defaultValue="0"
            onKeyPress={handleHoleScoreInput}
            disabled={inputsDisabled}
            pattern="\d*"
          />
        </div>
      </div>
      <div id="loop-display-container" className={`${styles["display-container"]} ${styles["centered"]}`}>
        <div id="loop-number-display" className={styles["number-display"]}>
          <div className={styles["display-label"]} id="loop-number-label">
            LOOP
          </div>
          <input
            type="number"
            className={styles["number-input"]}
            id="loop-number-input"
            value={loopNumber}
            min="1"
            max="10"
            readOnly
          />
        </div>
        <div id="loop-score-display" className={styles["score-display"]}>
          <div className={styles["display-label"]} id="loop-score-label">
            LOOP SCORE
          </div>
          <input
            type="number"
            id="loop-score-input"
            className={`${styles["score-input"]} ${styles["centered"]}`}
            value={loopScore}
            readOnly
          />
        </div>
      </div>
      <div className={`${styles["score-display"]} ${styles["centered"]}`}>
        <div id="score-label" className={styles["display-label"]}>
          SCORE
        </div>
        <div className={styles["score-value"]} id="score-value">{score}</div>
      </div>
    </div>
  );
};

export default ScoreContainer;
