import React, { useState, useEffect } from 'react';
import MasterContainer from './features/MasterContainer/MasterContainer';
import './App.css';
import SelectionContainer from './features/SelectionContainer/SelectionContainer';

function App() {
  const [selectedUser, setSelectedUser] = useState(localStorage.getItem("selectedUser"));
  const [selectedGame, setSelectedGame] = useState(localStorage.getItem("selectedGame"));

  useEffect(() => {
    const storedUser = localStorage.getItem("selectedUser");
    const storedGame = localStorage.getItem("selectedGame");
    if (storedUser) setSelectedUser(storedUser);
    if (storedGame) setSelectedGame(storedGame);
  }, []);

  return (
    <div className="app-container">
      {selectedUser && selectedGame ? (
        <MasterContainer userId={selectedUser} gameId={selectedGame} />
      ) : (
        <SelectionContainer />
      )}
    </div>
  );
}

export default App;
