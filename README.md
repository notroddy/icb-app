# Ice Cold Beer Real-Time Score Tracker

## Overview

The Ice Cold Beer Real-Time Score Tracker is a web application designed to help players keep track of their scores in the game Ice Cold Beer. The game display only shows 4 value places, making it difficult for players to track their scores accurately. This application allows players to record their scores, loops, and holes completed in real-time. Additionally, it provides features for players to stream their scores and share their achievements on social media.

## Features

- Real-time score tracking for Ice Cold Beer
- Track loops and holes completed
- Display scores in a user-friendly format
- Integration with streaming platforms (Twitch, YouTube, Instagram)
- Player profiles with statistics and social media handles
- Admin interface for managing games, game sessions, loops, and holes

## Installation

### Backend

1. Clone the repository:
    ```sh
    git clone https://github.com/not_roddy/icb-app.git
    cd icb-app/backend
    ```

2. **Install Poetry**:
   Follow the instructions at [Poetry's official website](https://python-poetry.org/docs/#installation) to install Poetry.

3. **Install dependencies**:
   ```sh
   poetry install
   ```

4. **Run migrations**:
   ```sh
   poetry run python manage.py migrate
   ```

5. **Start the server**:
   ```sh
   poetry run python manage.py runserver
   ```

### Frontend

1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000` to access the frontend.
2. Use the admin interface at `http://localhost:8000/admin` to manage games, game sessions, loops, and holes.
3. Players can create profiles, track their scores, and share their achievements on social media.

## API Documentation

### Endpoints

#### Authentication

- **Login**: `POST /login/`
  - Request body: `{ "username": "your_username", "password": "your_password" }`
  - Response: `{ "token": "your_token", "user_id": user_id }`

#### Players

- **Get Player Details**: `GET /player/<int:player_id>/`
  - Response: Player details including username, email, bio, and game statistics.

- **List Players**: `GET /players/`
  - Response: List of all players.

#### Game Sessions

- **Create Game Session**: `POST /game-session/create/`
  - Request body: `{ "game": game_id, "player": player_id, "arcade": arcade_id }`
  - Response: `{ "game_session_id": game_session_id }`

- **Update Game Session Score**: `PATCH /game-session/<int:game_session_id>/loop/<int:loop_number>/hole/<int:hole_number>/update-score/`
  - Request body: `{ "hole_score": score }`
  - Response: `{ "message": "Score updated successfully" }`

- **End Game Session**: `PATCH /game-session/<int:game_session_id>/end/`
  - Response: `{ "message": "Game session ended successfully" }`

- **Complete Loop**: `PATCH /game-session/<int:game_session_id>/loop/<int:loop_number>/complete/`
  - Response: `{ "status": "Loop completed", "loop_id": loop_id }`

#### Games

- **Get Game Details**: `GET /game/<int:game_id>/`
  - Response: Game details.

- **List Games**: `GET /games/`
  - Response: List of all games.

#### Arcades

- **List Arcades**: `GET /arcades/`
  - Response: List of all arcades.

## License

This project is licensed under the MIT License.