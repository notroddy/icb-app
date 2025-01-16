import React, { useEffect, useState } from "react";
import { getPlayerData, getGameData } from "../../utils/api";
import StatCard from "../StatCard/StatCard";
import SocialMediaHandles from "../SocialMediaHandles/SocialMediaHandles";
import wizardImage from "../../assets/images/wizard.png";
import styles from "./ProfileContainer.module.css";


/**
 * ProfileContainer component to display player profile and statistics.
 */
const ProfileContainer = ({ userId, gameId }) => {
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
  const [gameName, setGameName] = useState("");

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

  useEffect(() => {
    if (gameId) {
      getGameData(gameId)
        .then((data) => {
          setGameName(data.name);
        })
        .catch((error) => {
          console.error("Error fetching game data:", error);
        });
    }
  }, [gameId]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  const formatTime = (time) => {
    return new Date(time * 1000).toISOString().substr(11, 8);
  };

  return (
    <div className={styles["profile-container"]}>
      <div className={styles["profile-header"]}>
        <div className={styles["profile-picture-container"]}>
          <img src={wizardImage} alt="Profile" className={styles["profile-picture"]} />
        </div>
        <div className={styles["profile-details-container"]}>
          <div className={styles["profile-name-section"]}>
            <span className={styles["profile-name"]}>
              <h3>{player.username}</h3>
            </span>
          </div>
          <div className={styles["info-section"]}>
            <div className={styles["profile-detail"]} id="location">
              {player.location}
            </div>
            <div className={styles["profile-detail"]} id="home-arcade">
              {player.homeArcade}
            </div>
            <div className={styles["profile-detail"]} id="game-name">
              Game: {gameName}
            </div>
            <div className={styles["social-media-handles"]}>
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

      <div className={styles["stats-section"]}>
        <h3>Stats</h3>
        <div className={styles["stats-grid"]}>
          <StatCard
            title="Number of Games"
            value={formatNumber(player.number_of_games)}
          />
          <StatCard
            title="Best Total Score"
            value={formatNumber(player.highest_game_score)}
          />
          <StatCard
            title="Avg Total Score"
            value={formatNumber(player.average_game_score)}
          />
          <StatCard
            title="Loops Completed"
            value={formatNumber(player.number_of_loops)}
          />
          <StatCard
            title="Best Loop Score"
            value={formatNumber(player.highest_loop_score)}
          />
          <StatCard
            title="Avg Loop Score"
            value={formatNumber(player.average_loop_score)}
          />
          <StatCard
            title="Fastest Loop Time"
            value={formatTime(player.fastest_loop_time)}
          />
          <StatCard
            title="Avg Loop Time"
            value={formatTime(player.average_loop_time)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
