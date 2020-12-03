import React from "react";
import { useState, useEffect, useContext } from "react";
import AppContext from "./../../contexts/AppContext";
import {
  AVATARS,
  ARENA_COLORS,
  POWERUPS,
  WEAKNESSES,
} from "../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./JoinGame.scss";

function JoinGame() {
  const { socket, user, goToLobby, setIsHost } = useContext(AppContext);
  const [activeGames, setActiveGames] = useState([]);
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    socket.emit("getRooms");
    socket.on("rooms", (data) => {
      console.log(data);
      setActiveGames(JSON.parse(data));
    });
    socket.on("joinedLobby", () => {
      goToLobby();
      setIsHost(false);
    });
    socket.on("unknownCode", () => {
      alert("Unknown game code");
    });
    socket.on("tooManyPlayers", () => {
      alert("Too many players");
    });
    // eslint-disable-next-line
  }, []);

  const onClickJoinGame = (gameCode) => {
    socket.emit("joinGame", gameCode, user.username, user.equippedSkin);
  };

  return (
    <div className="JoinGame">
      <div className="topRow">
        <div className="activeGamesHeading">Active Games:</div>
        <input
          className="filterInput"
          onChange={(e) => setFilterInput(e.target.value)}
          placeholder="Filter by username or game code"
        />
      </div>

      {activeGames
        .filter(
          (game) =>
            game.host.toLowerCase().includes(filterInput.toLowerCase()) ||
            game.gameCode.toLowerCase().includes(filterInput.toLowerCase())
        )
        .map((game, idx) => (
          <div
            className="gameRow"
            key={game.host + idx}
            onClick={() => onClickJoinGame(game.gameCode)}
            style={
              game &&
              Object.values(ARENA_COLORS).find(
                (x) => x.name === game.arenaColor
              ).style
            }
          >
            <div className="avatar" style={AVATARS[game.equippedSkin].style}>
              <div
                className="avatarMouth"
                style={
                  game &&
                  Object.values(ARENA_COLORS).find(
                    (x) => x.name === game.arenaColor
                  ).style
                }
              />
            </div>
            <div className="gameRowLeft">
              <div className="gameInfo">
                <p>
                  <b>{game.host}'s Arena</b> ({game.gameCode})
                </p>
                <p>{game.numPlayers}/20 players</p>
              </div>
              <div className="extraDetails">
                <div>
                  <p>
                    <b>Mode:</b> {game.selectedGameMode}
                    <b className="spawnRate"> Spawn:</b>{" "}
                    {game.selectedSpawnRate}
                  </p>
                </div>
                <div>
                  {game.selectedPowerups.map((powerup) => (
                    <FontAwesomeIcon
                      icon={
                        Object.values(POWERUPS).find((x) => x.name === powerup)
                          ?.icon
                      }
                      className="powerupIcon"
                    />
                  ))}
                  {game.isGhostSelected && (
                    <FontAwesomeIcon
                      icon={WEAKNESSES.GHOST.icon}
                      className="powerupIcon"
                    />
                  )}
                  {game.isBombSelected && (
                    <FontAwesomeIcon
                      icon={WEAKNESSES.BOMB.icon}
                      className="powerupIcon"
                    />
                  )}
                  {game.isSlowSelected && (
                    <FontAwesomeIcon
                      icon={WEAKNESSES.SLOW.icon}
                      className="powerupIcon"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default JoinGame;
