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
        fetch('/api/csrf/', {
            method: 'GET',
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch CSRF token');
        }).then(data => {
            document.cookie = `csrftoken=${data.csrfToken}; path=/`;
        }).catch(error => {
            console.error('Error setting CSRF token:', error);
        });
    }
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
        return data;
    })
    .catch(error => {
        console.error('Error fetching player data:', error);
        throw error;
    });
}

export function createNewGameSession() {
    console.log('Creating new game session...');
    setCSRFToken();
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/game-session/create/`;

    const payload = {
        game: 1,
        player: 3, // Ensure this player ID exists
        arcade: 1  // Ensure this arcade ID exists
    };

    const csrfToken = getCSRFToken();

    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Game session created:', data);

        if (data.game_session_id) {
            currentGameSessionId = data.game_session_id;
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

    fetch(apiUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Hole score updated:', data);
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

    return fetch(apiUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Game session ended:', data);
        return data;
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

    return fetch(apiUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Loop completed:', data);
        return data;
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
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}