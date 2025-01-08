// Variables
let currentGameSessionId = null;

// Import helper functions
import { 
    getCSRFToken,
    updateGameSession,
    createNewGameSession
} from './api.js';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {

    updateTimeDisplay(0, 0, 0, 0); // Initialize the time display to 00:00:00.00
    updateScoreDisplay(); // Initialize the score display to 0

    document.getElementById('start-game-btn').addEventListener('click', () => {
        console.log('Start Game button clicked');
        stopTimeDisplay();
        resetTimeDisplay();
        resetScoreDisplay();
        createNewGameSession(); // Create a new game session when the page loads
        startStopwatch(); // Start stopwatch
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
        startStopwatch(); // Start stopwatch
        });

  

    document.getElementById('loop-score-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const inputValue = parseInt(e.target.value, 10);
            if (!isNaN(inputValue)) {
                animateScoreIncrement(inputValue);
                e.target.value = ''; // Clear the input field
            }
        }
    });

    document.getElementById('hole-score-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const holeScore = parseInt(e.target.value, 10); // Get the hole score value

            if (!isNaN(holeScore)) {
                const holeNumberInput = document.getElementById('hole-number-input');
                const loopNumberInput = document.getElementById('loop-number-input');
                const loopScoreInput = document.getElementById('loop-score-input');

                let loopScore = parseInt(loopScoreInput.value, 10) || 0;
                loopScore += holeScore;

                let holeNumber = parseInt(holeNumberInput.value, 10) || 1;
                let loopNumber = parseInt(loopNumberInput.value, 10) || 1;

                updateGameSession(holeNumber, loopNumber, holeScore); // Update the game session with the hole score

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