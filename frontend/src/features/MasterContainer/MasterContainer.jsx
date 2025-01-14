import React from "react";
import styles from "./MasterContainer.module.css";
import ProfileContainer from "../ProfileContainer/ProfileContainer";
import GameContainer from "../GameContainer/GameContainer";

/**
 * MasterContainer component that combines ProfileContainer and GameContainer.
 */
const MasterContainer = ({ userId }) => {
  console.log("User ID:", userId); // Log the user ID to the console

  return (
      <div className={styles["master-container"]}>
        <div id="profile-container" className={styles["profile-container"]}>
          <ProfileContainer userId={userId} />
        </div>
        <div id="game-container" className={styles["game-container"]}>
          <GameContainer />
        </div>
      </div>
  );
};

export default MasterContainer;
