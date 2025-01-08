// Variables
let score = 0;
let timerInterval;
let elapsedTime = 0;
let startTime;
let currentGameSessionId = null;

const gameData = {
    holes: {}, // Track scores for each hole within the current loop
    loopScores: [] // Store completed loop scores and details
};

export function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-value');
    if (score < 1000) {
        scoreDisplay.textContent = score;
    } else {
        scoreDisplay.textContent = score.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: true });
    }
}

export function resetScoreDisplay() {
    score = 0;
    updateScoreDisplay();
}

export function resetLoopDisplay() {
    const loopNumberInput = document.getElementById('loop-number-input');
    const loopScoreInput = document.getElementById('loop-score-input');
    loopNumberInput.value = 1;
    loopScoreInput.value = 0;
}

export function stopTimeDisplay() {
    clearInterval(timerInterval);
}

export function resetTimeDisplay() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    updateTimeDisplay(0, 0, 0); // Initialize the time display to 00:00:00
}

export function updateTimeDisplay(hours, minutes, seconds) {
    const timeDisplay = document.getElementById('time-value');
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timeDisplay.textContent = hours + ":" + minutes + ":" + seconds;
}

export function startStopwatch() {
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

export function updateBallsValueDisplay(ballValue) {
    const ballsValueDisplay = document.getElementById('balls-input');
    ballsValueDisplay.value = ballValue;
}

export function animateScoreIncrement(amount) {
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

export function addHoleScore(holeNumber, holeScore) {
    gameData.holes[holeNumber] = holeScore;
}

// Function to get the CSRF token from the cookies
export function getCSRFToken() {
    const cookieValue = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

export function getPlayerData(playerId) {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/player/${playerId}/`;

    const csrfToken = getCSRFToken();

    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched player data:', data); // Log the fetched data to the console
        return data;
    })
    .catch(error => {
        console.error('Error fetching player data:', error);
        throw error;
    });
}

// Function to create a new game session
export function createNewGameSession() {
    // Dynamically set the API base URL
    let baseUrl = window.location.origin; // Will give you the correct domain (http://127.0.0.1:8000 or https://yourdomain.com)
    // change the port of the baseUrl to 8000
    baseUrl = baseUrl.replace('3000', '8000');
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
export function updateGameSession(holeNumber, loopNumber, holeScore) {
    if (!currentGameSessionId) {
        console.error('Game session ID is not available. Cannot update hole scores.');
        return;
    }

    // Dynamically set the API base URL
    let baseUrl = window.location.origin; // Will give you the correct domain (http://127.0.0.1:8000 or https://yourdomain.com)
    // change the port of the baseUrl to 8000
    baseUrl = baseUrl.replace('3000', '8000');
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