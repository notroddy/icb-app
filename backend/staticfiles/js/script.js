// Variables
let score = 0;
let timerInterval;
let elapsedTime = 0;
let startTime;
let currentGameSessionId = null;

// Data Structure to Track Scores
const gameData = {
    holes: {}, // Track scores for each hole within the current loop
    loopScores: [] // Store completed loop scores and details
};

// Functions
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-value');
    if (score < 1000) {
        scoreDisplay.textContent = score;
    } else {
        scoreDisplay.textContent = score.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: true });
    }
}

function formatNumberWithCommas(number) {
    return number.toLocaleString('en-US');
}



function resetScoreDisplay() {
    score = 0;
    updateScoreDisplay();
}

function stopTimeDisplay() {
    clearInterval(timerInterval);
}

function resetTimeDisplay() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    updateTimeDisplay(0, 0, 0); // Initialize the time display to 00:00:00
}

function updateTimeDisplay(hours, minutes, seconds) {
    const timeDisplay = document.getElementById('time-value');
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timeDisplay.textContent = hours + ":" + minutes + ":" + seconds;
}

function startStopwatch() {
    clearInterval(timerInterval); // Clear any existing interval
    startTime = Date.now() - elapsedTime; // Set startTime to account for elapsed time

    function updateTimer() {
        elapsedTime = Date.now() - startTime; // Update elapsedTime
        const hours = Math.floor(elapsedTime / (3600 * 1000));
        const minutes = Math.floor((elapsedTime % (3600 * 1000)) / (60 * 1000));
        const seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);
        updateTimeDisplay(hours, minutes, seconds);
    }

    updateTimer(); // Update timer immediately
    timerInterval = setInterval(updateTimer, 1000); // Update every second
}

function updateBallsValueDisplay(ballValue) {
    const ballsValueDisplay = document.getElementById('balls-input');
    ballsValueDisplay.value = ballValue;
}

function animateScoreIncrement(amount) {
    let targetScore = score + amount;
    let incrementSpeed = 0.1; // Increment speed in milliseconds

    function increment() {
        if (score < targetScore) {
            score++;
            updateScoreDisplay();
            setTimeout(increment, incrementSpeed);
        } else {
            score = targetScore; // Ensure the score matches the target precisely
            updateScoreDisplay();
        }
    }

    increment();
}

function addHoleScore(holeNumber, holeScore) {
    gameData.holes[holeNumber] = holeScore;
}
// Function to get the CSRF token from the cookies
function getCSRFToken() {
    const cookieValue = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

// Function to create a new game session
function createNewGameSession() {
    // Dynamically set the API base URL
    const baseUrl = window.location.origin; // Will give you the correct domain (http://127.0.0.1:8000 or https://yourdomain.com)
    const apiUrl = `${baseUrl}/api/game-session/create/`; // Append your endpoint to the base URL

    const payload = {
        game: 1, // Replace with your actual game ID
        player: 1, // Replace with your actual player ID
        arcade: 1 // Replace with your actual arcade ID
    };

    const csrfToken = getCSRFToken(); // Get the CSRF token from the cookies

    // Send the POST request to create the game session
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Game session created:', data);

        if (data.game_session_id) {
            // Store the session ID in the global variable
            currentGameSessionId = data.game_session_id;
        } else {
            console.error('Game session creation response does not contain an ID.');
        }
    })
    .catch(error => {
        console.error('Error creating game session:', error);
    });
}

// Function to update the hole scores for a game session
function updateGameSession(holeNumber, loopNumber, holeScore) {
    if (!currentGameSessionId) {
        console.error('Game session ID is not available. Cannot update hole scores.');
        return;
    }

    // Dynamically set the API base URL
    const baseUrl = window.location.origin; // Will give you the correct domain
    const apiUrl = `${baseUrl}/api/game-session/${currentGameSessionId}/loop/${loopNumber}/hole/${holeNumber}/update-score/`; // Append your endpoint to the base URL

    const payload = {
        hole_score: holeScore
    };

    const csrfToken = getCSRFToken(); // Get the CSRF token from the cookies

    // Send the PATCH request to update the hole score
    fetch(apiUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Hole score updated:', data);
    })
    .catch(error => {
        console.error('Error updating hole score:', error);
    });
}

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
