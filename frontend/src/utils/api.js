import axios from 'axios';

let score = 0;
let timerInterval;
let elapsedTime = 0;
let startTime;
let currentGameSessionId = null;

const gameData = {
    holes: {},
    loopScores: []
};

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

export function resetScoreDisplay() {
    score = 0;
    updateScoreDisplay();
}

export function resetLoopDisplay() {
    const loopNumberInput = document.getElementById('loop-number-input');
    const loopScoreInput = document.getElementById('loop-score-input');
    if (loopNumberInput && loopScoreInput) {
        loopNumberInput.value = 1;
        loopScoreInput.value = 0;
    }
}

export function resetHoleDisplay() {
    const holeNumberInput = document.getElementById('hole-number-input');
    if (holeNumberInput) {
        holeNumberInput.value = 1;
    }
}

export function stopTimeDisplay() {
    clearInterval(timerInterval);
}

export function resetTimeDisplay() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    updateTimeDisplay(0, 0, 0);
}

export function updateTimeDisplay(hours, minutes, seconds) {
    const timeDisplay = document.getElementById('time-value');
    if (timeDisplay) {
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timeDisplay.textContent = hours + ":" + minutes + ":" + seconds;
    }
}

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

export function updateBallsValueDisplay(ballValue) {
    const ballsValueDisplay = document.getElementById('balls-input');
    if (ballsValueDisplay) {
        ballsValueDisplay.value = ballValue;
    }
}

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

export function addHoleScore(holeNumber, holeScore) {
    gameData.holes[holeNumber] = holeScore;
}

export function getCSRFToken() {
    const cookieValue = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

function setCSRFToken() {
    const csrfToken = getCSRFToken();
    if (!csrfToken) {
        axios.get('/api/csrf/', { withCredentials: true })
            .then(response => {
                document.cookie = `csrftoken=${response.data.csrfToken}; path=/`;
            })
            .catch(error => {
                console.error('Error setting CSRF token:', error);
            });
    }
}

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
        console.error('Error fetching player data:', error);
        throw error;
    });
}

export function createNewGameSession( playerId, gameId, arcadeId ) {
    console.log('Creating new game session...');
    setCSRFToken();
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/game-session/create/`;
    console.log('playerId:', playerId);
    console.log('gameId:', gameId);
    console.log('arcadeId:', arcadeId);

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
        console.log('Game session created:', response.data);

        if (response.data.game_session_id) {
            currentGameSessionId = response.data.game_session_id;
            console.log('Current game session ID:', currentGameSessionId);
            return currentGameSessionId;
        } else {
            console.error('Game session creation response does not contain an ID.');
            throw new Error('Game session creation response does not contain an ID.');
        }
    })
    .catch(error => {
        console.error('Error creating game session:', error);
        throw error;
    });
}

export function updateGameSession(loopNumber, holeNumber, holeScore) {
    if (holeScore === undefined) {
        console.error('Hole score is undefined');
        return;
    }

    console.log(`Updating game session ID: ${currentGameSessionId}, loop: ${loopNumber}, hole: ${holeNumber} with score: ${holeScore}`);
    
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
        console.log('Hole score updated:', response.data);
    })
    .catch(error => {
        console.error('Error updating hole score:', error);
    });
}

export function endGameSession(gameSessionId) {
    console.log(`Ending game session ID: ${gameSessionId}`);
    
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
        console.log('Game session ended:', response.data);
        return response.data;
    })
    .catch(error => {
        console.error('Error ending game session:', error);
        throw error;
    });
}

export function completeLoop(gameSessionId, loopNumber) {
    console.log(`Completing loop number ${loopNumber} for game session ID: ${gameSessionId}`);
    
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
        console.log('Loop completed:', response.data);
        return response.data;
    })
    .catch(error => {
        console.error('Error completing loop:', error);
        throw error;
    });
}

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
        console.error('Error:', error);
        throw error;
    }
}

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
        console.error('Error fetching game data:', error);
        throw error;
    });
}

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
        console.error('Error fetching arcade ID for player:', error);
        throw error;
    });
}