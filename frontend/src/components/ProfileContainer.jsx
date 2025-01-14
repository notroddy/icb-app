import React, { useEffect, useState } from "react";
import "./styles/ProfileContainer.css";
import wizardImage from "../assets/images/wizard.png";

import { getPlayerData } from "../utils/api";
import StatCard from "./StatCard";
import SocialMediaHandles from "./SocialMediaHandles";

/**
 * ProfileContainer component to display player profile and statistics.
 */
const ProfileContainer = ({ userId }) => {
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
    fastest_loop_time: "",
    average_loop_time: "",
  });

  useEffect(() => {
    if (userId) {
      getPlayerData(userId)
        .then((data) => {
          console.log("Player data:", data);
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
            fastest_loop_time: data.fastest_loop_time || 0,
            average_loop_time: data.average_loop_time || 0,
          });
        })
        .catch((error) => {
          console.error("Error fetching player data:", error);
        });
    }
  }, [userId]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);};

  const formatTime = (time) => {
    return new Date(time * 1000).toISOString().substr(11, 8);
  };

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
          <StatCard title="Best Total Score" value={formatNumber(player.highest_game_score)} />
          <StatCard title="Avg Total Score" value={formatNumber(player.average_game_score)} />
          <StatCard title="Loops Completed" value={formatNumber(player.number_of_loops)} />
          <StatCard title="Best Loop Score" value={formatNumber(player.highest_loop_score)} />
          <StatCard title="Avg Loop Score" value={formatNumber(player.average_loop_score)} />
          <StatCard title="Fastest Loop Time" value={formatTime(player.fastest_loop_time)} />
          <StatCard title="Avg Loop Time" value={formatTime(player.average_loop_time)} />

        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
