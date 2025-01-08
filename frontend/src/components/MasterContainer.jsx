import React from "react";
import "./styles/MasterContainer.css";
import ProfileContainer from "./ProfileContainer";
import GameContainer from "./GameContainer";

const MasterContainer = () => {
  return (
    <div className="master-container">
      <div className="container-left"><ProfileContainer /> </div>
      <div className="container-right"><GameContainer /> </div>
    </div>
  );
};

export default MasterContainer;
