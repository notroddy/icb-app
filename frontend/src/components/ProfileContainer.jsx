import React, { useEffect, useState } from "react";
import "./styles/ProfileContainer.css";
import wizardImage from "../assets/images/wizard.png";

import { getPlayerData } from "../utils/api";
import StatCard from "./StatCard";
import SocialMediaHandles from "./SocialMediaHandles";

const playerId = 2;

/**
 * ProfileContainer component to display player profile and statistics.
 */
const ProfileContainer = () => {
  const [player, setPlayer] = useState({
    username: "",
    location: "",
    team: "",
    highestScore: "",
    homeArcade: "",
    twitch: "",
    youtube: "",
    instagram: "",
    number_of_games: "",
    highest_game_score: "",
    average_game_score: "",
    number_of_loops: "",
    highest_loop_score: "",
    average_loop_score: "",
  });

  useEffect(() => {
    getPlayerData(playerId)
      .then((data) => {
        setPlayer({
          username: data.username,
          location: `${data.city}, ${data.country}`,
          team: data.team,
          highestScore: data.highest_score,
          homeArcade: data.arcade,
          twitch: data.twitch || "",
          youtube: data.youtube || "",
          instagram: data.instagram || "",
          number_of_games: data.number_of_games || 0,
          highest_game_score: data.highest_game_score || 0,
          average_game_score: data.average_game_score || 0,
          number_of_loops: data.number_of_loops || 0,
          highest_loop_score: data.highest_loop_score || 0,
          average_loop_score: data.average_loop_score || 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching player data:", error);
      });
  }, []);

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);};

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture-container">
        <img src={wizardImage} alt="Profile" className="profile-picture" />
        </div>
        <div className="profile-details-container">
          <div className="profile-name-section">
          <span className="profile-name">
            <h3>{player.username}</h3>
            </span>
          </div>
          <div className="info-section">
              <div className='profile-detail' id="location">{player.location}</div>
              <div className='profile-detail' id="home-arcade">{player.homeArcade}</div>
            <div className="social-media-handles">
              {player.twitch && (
                <SocialMediaHandles data={{ twitch: player.twitch }} />
              )}
              {player.youtube && (
                <SocialMediaHandles data={{ youtube: player.youtube }} />
              )}
              {player.instagram && (
                <SocialMediaHandles data={{ instagram: player.instagram }} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>Stats</h3>
        <div className="stats-grid">
          <StatCard title="Number of Games" value={formatNumber(player.number_of_games)} />
          <StatCard title="Highest Total Score" value={formatNumber(player.highest_game_score)} />
          <StatCard title="Average Total Score" value={formatNumber(player.average_game_score)} />
          <StatCard title="Loops Completed" value={formatNumber(player.number_of_loops)} />
          <StatCard title="Highest Loop Score" value={formatNumber(player.highest_loop_score)} />
          <StatCard title="Average Loop Score" value={formatNumber(player.average_loop_score)} />
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
