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
    updateTimeDisplay(0, 0, 0);
}

export function updateTimeDisplay(hours, minutes, seconds) {
    const timeDisplay = document.getElementById('time-value');
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timeDisplay.textContent = hours + ":" + minutes + ":" + seconds;
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
    ballsValueDisplay.value = ballValue;
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
        console.log('Fetched player data:', data);
        return data;
    })
    .catch(error => {
        console.error('Error fetching player data:', error);
        throw error;
    });
}

export function createNewGameSession() {
    let baseUrl = window.location.origin;
    baseUrl = baseUrl.replace('3000', '8000');
    const apiUrl = `${baseUrl}/api/game-session/create/`;

    const payload = {
        game: 1,
        player: 1,
        arcade: 1
    };

    const csrfToken = getCSRFToken();

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Game session created:', data);

        if (data.game_session_id) {
            currentGameSessionId = data.game_session_id;
        } else {
            console.error('Game session creation response does not contain an ID.');
        }
    })
    .catch(error => {
        console.error('Error creating game session:', error);
    });
}

export function updateGameSession(holeNumber, loopNumber, holeScore) {
    if (!currentGameSessionId) {
        console.error('Game session ID is not available. Cannot update hole scores.');
        return;
    }

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
    .then(response => response.json())
    .then(data => {
        console.log('Hole score updated:', data);
    })
    .catch(error => {
        console.error('Error updating hole score:', error);
    });
}