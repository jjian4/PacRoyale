import React from "react";
import { useState, useContext, useEffect } from "react";
import AppContext from "./../../contexts/AppContext";
import {
  AVATARS,
  ARENA_COLORS,
  POWERUPS,
  WEAKNESSES,
} from "./../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Lobby.scss";

function Lobby() {
  const { isHost, socket, goToMainMenu, goToArena } = useContext(AppContext);

  const [lobbyInfo, setLobbyInfo] = useState({});
  const { gameCode, players, host } = lobbyInfo;

  useEffect(() => {
    socket.emit("getRoom");
    socket.on("init", () => {
      goToArena();
    });
    socket.on("lobbyDisconnect", () => {
      goToMainMenu();
    });
    socket.on("room", (data) => {
      console.log(JSON.parse(data));
      setLobbyInfo(JSON.parse(data));
    });
    // eslint-disable-next-line
  }, []);

  const startGame = () => {
    socket.emit("startGame", gameCode);
    goToArena();
  };

  console.log(players);

  return (
    <div className="Lobby">
      <div className="title">
        <b>{host}'s Lobby</b> ({gameCode})
      </div>
      <div className="lobbyInfoRow">
        <span>
          <b>Game Mode:</b> {lobbyInfo.selectedGameMode}
        </span>
        <span>
          <b>Spawn Rate:</b> {lobbyInfo.selectedSpawnRate}
        </span>

        <div>
          {lobbyInfo.selectedPowerups &&
            lobbyInfo.selectedPowerups.map((powerup) => (
              <FontAwesomeIcon
                icon={
                  Object.values(POWERUPS).find((x) => x.name === powerup)?.icon
                }
                className="powerupIcon"
              />
            ))}
          {lobbyInfo.isGhostSelected && (
            <FontAwesomeIcon
              icon={WEAKNESSES.GHOST.icon}
              className="powerupIcon"
            />
          )}
          {lobbyInfo.isBombSelected && (
            <FontAwesomeIcon
              icon={WEAKNESSES.BOMB.icon}
              className="powerupIcon"
            />
          )}
          {lobbyInfo.isSlowSelected && (
            <FontAwesomeIcon
              icon={WEAKNESSES.SLOW.icon}
              className="powerupIcon"
            />
          )}
        </div>
      </div>
      <div
        className="playerList"
        style={
          lobbyInfo.arenaColor &&
          Object.values(ARENA_COLORS).find(
            (x) => x.name === lobbyInfo.arenaColor
          ).style
        }
      >
        <div className="row">
          {players &&
            players.map((player, index) => (
              <div className="col-md-6" key={index}>
                <div className="playerRow">
                  <div
                    className="avatar"
                    style={AVATARS[player.equippedSkin].style}
                  >
                    <div className="avatarMouth" />
                  </div>
                  {player.username} {player.isHost && "(host)"}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="playerCount">
        <span>
          <b>{players && players.length}/20</b>
        </span>{" "}
        Players Joined
      </div>
      <div className="lobbyBottom">
        {isHost && (
          <div className="hostButtons">
            {/* TODO: Cancel game */}
            <button
              className="button"
              onClick={() => {
                socket.emit("playerDisconnect");
              }}
            >
              Cancel Game
            </button>
            {/* TODO: Open Game settings modal */}
            <button className="button" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}
        {!isHost && (
          <>
            <button
              className="button"
              onClick={() => {
                socket.emit("playerDisconnect");
              }}
            >
              Leave Game
            </button>
            <div className="nonHostMessage">
              Waiting for the host to start the game...
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Lobby;
