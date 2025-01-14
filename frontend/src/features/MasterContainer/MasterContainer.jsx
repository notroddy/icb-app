import React from "react";
import "./MasterContainer.module.css";
import ProfileContainer from "../ProfileContainer/ProfileContainer";
import GameContainer from "../GameContainer/GameContainer";

/**
 * MasterContainer component that combines ProfileContainer and GameContainer.
 */
const MasterContainer = ({ userId }) => {
  console.log("User ID:", userId); // Log the user ID to the console

  return (
    <div className="master-container-wrapper">
      <div className="master-container">
        <div className="container-left"><ProfileContainer userId={userId} /> </div>
        <div className="container-right"><GameContainer /> </div>
      </div>
    </div>
  );
};

export default MasterContainer;
