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
    git clone https://github.com/yourusername/icb-app.git
    cd icb-app/backend
    ```

2. Create a virtual environment and activate it:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Apply the migrations:
    ```sh
    python manage.py makemigrations
    python manage.py migrate
    ```

5. Create a superuser:
    ```sh
    python manage.py createsuperuser
    ```

6. Start the development server:
    ```sh
    python manage.py runserver
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

#### Player Endpoints

- **Get Player Data**
    - **URL:** `/api/player/<int:player_id>/`
    - **Method:** `GET`
    - **Description:** Retrieve player data by player ID.

#### Game Session Endpoints

- **Create Game Session**
    - **URL:** `/api/game-session/create/`
    - **Method:** `POST`
    - **Description:** Create a new game session.
    - **Payload:**
        ```json
        {
            "game": 1,
            "player": 2,
            "arcade": 1
        }
        ```

- **Update Game Session Score**
    - **URL:** `/api/game-session/<int:game_session_id>/loop/<int:loop_number>/hole/<int:hole_number>/update-score/`
    - **Method:** `PATCH`
    - **Description:** Update the score for a specific hole in a loop.
    - **Payload:**
        ```json
        {
            "hole_score": 100
        }
        ```

- **End Game Session**
    - **URL:** `/api/game-session/<int:game_session_id>/end/`
    - **Method:** `PATCH`
    - **Description:** Mark a game session as ended.

- **Complete Loop**
    - **URL:** `/api/game-session/<int:game_session_id>/loop/<int:loop_number>/complete/`
    - **Method:** `PATCH`
    - **Description:** Mark a loop as completed.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.