let currentGameSessionId = null;

import { 
    getCSRFToken,
    updateGameSession,
    createNewGameSession
} from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    updateTimeDisplay(0, 0, 0, 0);
    updateScoreDisplay();

    document.getElementById('start-game-btn').addEventListener('click', () => {
        console.log('Start Game button clicked');
        stopTimeDisplay();
        resetTimeDisplay();
        resetScoreDisplay();
        createNewGameSession();
        startStopwatch();
    });

    document.getElementById('end-game-btn').addEventListener('click', () => {
        console.log('End Game button clicked');
        stopTimeDisplay();
        resetTimeDisplay();
        resetScoreDisplay();
    });

    document.getElementById('reset-game-btn').addEventListener('click', () => {
        stopTimeDisplay();
        resetTimeDisplay();
        resetScoreDisplay();
        createNewGameSession();
        startStopwatch();
    });

    document.getElementById('loop-score-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const inputValue = parseInt(e.target.value, 10);
            if (!isNaN(inputValue)) {
                animateScoreIncrement(inputValue);
                e.target.value = '';
            }
        }
    });

    document.getElementById('hole-score-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const holeScore = parseInt(e.target.value, 10);

            if (!isNaN(holeScore)) {
                const holeNumberInput = document.getElementById('hole-number-input');
                const loopNumberInput = document.getElementById('loop-number-input');
                const loopScoreInput = document.getElementById('loop-score-input');

                let loopScore = parseInt(loopScoreInput.value, 10) || 0;
                loopScore += holeScore;

                let holeNumber = parseInt(holeNumberInput.value, 10) || 1;
                let loopNumber = parseInt(loopNumberInput.value, 10) || 1;

                updateGameSession(holeNumber, loopNumber, holeScore);

                console.log(`Hole ${holeNumber} score: ${holeScore}`);
                loopScoreInput.value = loopScore;
                console.log(`Updated Loop Score: ${loopScore}`);

                addHoleScore(holeNumber, holeScore);

                e.target.value = '';

                if (holeNumber === 10) {
                    score += loopScore;
                    updateScoreDisplay();

                    gameData.loopScores.push({ loop: loopNumber, score: loopScore, holes: { ...gameData.holes } });
                    console.log(`Loop ${loopNumber} completed.`);
                    console.log(`Hole Scores:`, gameData.holes);
                    console.log(`Total Loop Score: ${loopScore}`);

                    gameData.holes = {};
                    loopScoreInput.value = '0';
                    holeNumber = 1;
                    loopNumber += 1;
                    loopNumberInput.value = loopNumber;
                } else {
                    holeNumber += 1;
                }
                holeNumberInput.value = holeNumber;
            }
        }
    });
});