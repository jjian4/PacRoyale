import React from "react";
import { useState, useContext, useEffect } from "react";
import AppContext from "./../../contexts/AppContext";
import "./Lobby.scss";

// TODO: move this to a constant file
const AVATARS = {
  BLUE: "blue",
  RED: "red",
  GOLD: "gold",
  FAZE: "faze",
};

function Lobby() {
  const { socket, goToMainMenu } = useContext(AppContext);
  const { isHost, goToArena } = useContext(AppContext);
  const [players, setPlayers] = useState([]);
  const [gameCode, setGameCode] = useState("");
  const [host, setHost] = useState("");
  useEffect(() => {
    socket.emit("getPlayers");
    socket.on("hostDisconnect", () => {
      goToMainMenu();
    });
    socket.on("playerDisconnect", () => {
      goToMainMenu();
    });
    socket.on("players", (data) => {
      const lobbyInfo = JSON.parse(data);
      setGameCode(lobbyInfo.gameCode);
      setHost(lobbyInfo.host);
      setPlayers(
        lobbyInfo.players.map((player) => {
          return { ...player, avatar: AVATARS.BLUE };
        })
      );
    });
  }, []);

  const startGame = () => {
    // TODO: Start the game in socketio

    goToArena();
  };

  return (
    <div className="Lobby">
      <div className="title">{host}'s Lobby</div>

      <div className="lobbyInfoRow">
        <span>
          <span className="playerCount">{players.length}/20</span> Players
          Joined
        </span>
        <span>
          Game Code: <span className="gameCode">{gameCode}</span>
        </span>
      </div>

      <div className="playerList">
        <div className="row">
          {players.map((player, index) => (
            <div className="col-md-6" key={index}>
              <div className="playerRow">
                <div className={`avatar avatar-${player.avatar}`}></div>
                {player.username} {player.isHost && "(host)"}
              </div>
            </div>
          ))}
        </div>
      </div>

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
          <button className="button">Edit Game</button>
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
  );
}

export default Lobby;
