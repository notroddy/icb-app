import React, { useState } from "react";
import styles from "./MasterContainer.module.css";
import ProfileContainer from "../ProfileContainer/ProfileContainer";
import GameContainer from "../GameContainer/GameContainer";
import SelectionContainer from "../SelectionContainer/SelectionContainer";

/**
 * MasterContainer component that combines ProfileContainer and GameContainer.
 */

/**
 * @param {Object} props - The props object.
 * @param {string} props.userId - The ID of the user.
 * @param {string} props.gameId - The ID of the game.
 * @param {string} props.arcadeId - The ID of the arcade.
 */
const MasterContainer = ({ userId, gameId, arcadeId }) => {
  const [showSelection, setShowSelection] = useState(false);

  const storedUserId = localStorage.getItem("selectedUser");
  const storedGameId = localStorage.getItem("selectedGame");
  const storedArcadeId = localStorage.getItem("arcadeId");

  const finalUserId = userId || storedUserId;
  const finalGameId = gameId || storedGameId;
  const finalArcadeId = arcadeId || storedArcadeId;

  if (showSelection || !finalUserId || !finalGameId || !finalArcadeId) {
    return (
      <div className={`${styles["master-container"]} ${styles["color-scheme"]}`}>
        <SelectionContainer />
      </div>
    );
  }

  return (
    <div className={`${styles["master-container"]} ${styles["color-scheme"]}`}>
      {/* <button onClick={() => setShowSelection(true)}>Back to Selection</button> */}
      <div id="profile-container">
        <ProfileContainer userId={finalUserId} gameId={finalGameId}/>
      </div>
      <div id="game-container">
        <GameContainer userId={finalUserId} gameId={finalGameId} arcadeId={finalArcadeId}/>
      </div>
    </div>
  );
};

export default MasterContainer;
