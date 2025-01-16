import axios from 'axios';
import logger from './logger';

// Variables to store game state
let score = 0;
let timerInterval;
let elapsedTime = 0;
let startTime;
let currentGameSessionId = null;

const gameData = {
    holes: {},
    loopScores: []
};

// Function to update the score display
export function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score-value');
    if (scoreDisplay) {
        if (score < 1000) {
            scoreDisplay.textContent = score;
        } else {
            scoreDisplay.textContent = score.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: true });
        }
    }
}

// Function to reset the score display
export function resetScoreDisplay() {
    score = 0;
    updateScoreDisplay();
}

// Function to reset the loop display
export function resetLoopDisplay() {
    const loopNumberInput = document.getElementById('loop-number-input');
    const loopScoreInput = document.getElementById('loop-score-input');
    if (loopNumberInput && loopScoreInput) {
        loopNumberInput.value = 1;
        loopScoreInput.value = 0;
    }
}

// Function to reset the hole display
export function resetHoleDisplay() {
    const holeNumberInput = document.getElementById('hole-number-input');
    if (holeNumberInput) {
        holeNumberInput.value = 1;
    }
}

// Function to stop the time display
export function stopTimeDisplay() {
    clearInterval(timerInterval);
}

// Function to reset the time display
export function resetTimeDisplay() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    updateTimeDisplay(0, 0, 0);
}

// Function to update the time display
export function updateTimeDisplay(hours, minutes, seconds) {
    const timeDisplay = document.getElementById('time-value');
    if (timeDisplay) {
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timeDisplay.textContent = hours + ":" + minutes + ":" + seconds;
    }
}

// Function to start the stopwatch
export function startStopwatch() {
    clearInterval(timerInterval);
    startTime = Date.now() - elapsedTime;

    function updateTimer() {
        elapsedTime = Date.now() - startTime;
        const hours = Math.floor(elapsedTime / (3600 * 1000));
        const minutes = Math.floor((elapsedTime % (3600 * 1000)) / (60 * 1000));
        const seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);
        updateTimeDisplay(hours, minutes, seconds);
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

// Function to update the balls value display
export function updateBallsValueDisplay(ballValue) {
    const ballsValueDisplay = document.getElementById('balls-input');
    if (ballsValueDisplay) {
        ballsValueDisplay.value = ballValue;
    }
}

// Function to animate the score increment
export function animateScoreIncrement(amount) {
    let targetScore = score + amount;
    let incrementSpeed = 0.1;

    function increment() {
        if (score < targetScore) {
            score++;
            updateScoreDisplay();
            setTimeout(increment, incrementSpeed);
        } else {
            score = targetScore;
            updateScoreDisplay();
        }
    }

    increment();
}

// Function to add a hole score
export function addHoleScore(holeNumber, holeScore) {
    gameData.holes[holeNumber] = holeScore;
}

// Function to get the CSRF token
export function getCSRFToken() {
    const cookieValue = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

// Function to set the CSRF token
function setCSRFToken() {
    const csrfToken = getCSRFToken();
    if (!csrfToken) {
        axios.get('/api/csrf/', { withCredentials: true })
            .then(response => {
                document.cookie = `csrftoken=${response.data.csrfToken}; path=/`;
            })
            .catch(error => {
                logger.error('Error setting CSRF token:', error);
            });
    }
}

// Function to get player data
export function getPlayerData(playerId) {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/player/${playerId}/`;

    const csrfToken = getCSRFToken();

    return axios.get(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => response.data)
    .catch(error => {
        logger.error('Error fetching player data:', error);
        throw error;
    });
}

// Function to create a new game session
export function createNewGameSession(playerId, gameId, arcadeId) {
    setCSRFToken();
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/game-session/create/`;

    const payload = {
        game: gameId, 
        player: playerId, 
        arcade: arcadeId, 
    };

    const csrfToken = getCSRFToken();

    return axios.post(apiUrl, payload, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        if (response.data.game_session_id) {
            currentGameSessionId = response.data.game_session_id;
            return currentGameSessionId;
        } else {
            throw new Error('Game session creation response does not contain an ID.');
        }
    })
    .catch(error => {
        logger.error('Error creating game session:', error);
        throw error;
    });
}

// Function to update the game session
export function updateGameSession(loopNumber, holeNumber, holeScore) {
    if (holeScore === undefined) {
        logger.error('Hole score is undefined');
        return;
    }

    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/game-session/${currentGameSessionId}/loop/${loopNumber}/hole/${holeNumber}/update-score/`;

    const payload = {
        hole_score: holeScore
    };

    const csrfToken = getCSRFToken();

    axios.patch(apiUrl, payload, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        // ...existing code...
    })
    .catch(error => {
        logger.error('Error updating hole score:', error);
    });
}

// Function to end the game session
export function endGameSession(gameSessionId) {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/game-session/${gameSessionId}/end/`;

    const csrfToken = getCSRFToken();

    return axios.patch(apiUrl, {}, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        logger.error('Error ending game session:', error);
        throw error;
    });
}

// Function to complete the loop
export function completeLoop(gameSessionId, loopNumber) {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/game-session/${gameSessionId}/loop/${loopNumber}/complete/`;

    const csrfToken = getCSRFToken();

    return axios.patch(apiUrl, {}, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        logger.error('Error completing loop:', error);
        throw error;
    });
}

// Function to login the user
export async function loginUser(username, password) {
    try {
        let baseUrl = window.location.origin;
        baseUrl = baseUrl.replace('3000', '8000');
        const apiUrl = `${baseUrl}/api/login/`;
        const response = await axios.post(apiUrl, { username, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        logger.error('Error:', error);
        throw error;
    }
}

// Function to get game data
export function getGameData(gameId) {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/game/${gameId}/`;

    return axios.get(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.data)
    .catch(error => {
        logger.error('Error fetching game data:', error);
        throw error;
    });
}

// Function to fetch players
export function fetchPlayers() {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/players/`;
    return axios.get(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.data);
}

// Function to fetch games
export function fetchGames() {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/games/`;
    return axios.get(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.data);
}

// Function to fetch arcade
export function fetchArcade() {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/arcade/`;
    return axios.get(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.data);
}

// Function to get arcade ID for player
export function getArcadeIdForPlayer(playerId) {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/player/${playerId}/`;

    return axios.get(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.data.arcade_id)
    .catch(error => {
        logger.error('Error fetching arcade ID for player:', error);
        throw error;
    });
}