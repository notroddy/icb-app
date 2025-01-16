import React, { useState, useEffect } from "react";
import { fetchPlayers, fetchGames, getPlayerData, getArcadeIdForPlayer } from "../../utils/api";
import MasterContainer from "../MasterContainer/MasterContainer";
import styles from "./SelectionContainer.module.css";

/**
 * SelectionContainer component to select user and game.
 */
const SelectionContainer = () => {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [arcadeId, setArcadeId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Fetch users and games on component mount
  useEffect(() => {
    fetchPlayers().then((data) => {
      setUsers(data);
    });
    fetchGames().then((data) => {
      setGames(data);
    });
  }, []);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedUser && selectedGame) {
      getPlayerData(selectedUser).then((data) => {
        localStorage.setItem("selectedUser", selectedUser);
        localStorage.setItem("selectedGame", selectedGame);
        getArcadeIdForPlayer(selectedUser).then((arcadeId) => {
          localStorage.setItem("arcadeId", arcadeId);
          setSubmitted(true);
        });
      });
    }
  };

  // Render MasterContainer if form is submitted
  if (submitted) {
    return <MasterContainer userId={selectedUser} gameId={selectedGame} arcadeId={arcadeId}/>;
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2>Setup Your Game</h2>
        <label>
          Select User:
          <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </label>
        <label>
          Select Game:
          <select onChange={(e) => setSelectedGame(e.target.value)} value={selectedGame}>
            <option value="">Select a game</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SelectionContainer;
