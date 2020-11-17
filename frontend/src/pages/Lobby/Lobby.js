import React from "react";
import { useState, useContext, useEffect } from "react";
import AppContext from "./../../contexts/AppContext";
import musicMp3 from '../../sounds/menu-music.mp3';
import { AVATARS } from "./../../utils/constants";
import "./Lobby.scss";

function Lobby() {
  const { isHost, socket, goToMainMenu, goToArena } = useContext(AppContext);
  const [players, setPlayers] = useState([]);
  const [gameCode, setGameCode] = useState("");
  const [host, setHost] = useState("");

  let music = new Audio(musicMp3);
  music.loop = true;

  useEffect(() => {
    socket.emit("getPlayers");
    socket.on("init", () => {
      goToArena();
    });
    socket.on("hostDisconnect", () => {
      goToMainMenu();
    });
    socket.on("playerDisconnect", () => {
      goToMainMenu();
    });
    socket.on("players", (data) => {
      const lobbyInfo = JSON.parse(data);
      console.log(lobbyInfo);
      setGameCode(lobbyInfo.gameCode);
      setHost(lobbyInfo.host);
      setPlayers(lobbyInfo.players);
    });

    music.play();

    return () => {
      music.pause();
      music.currentTime = 0;
    }
  }, []);

  const startGame = () => {
    // TODO: Start the game in socketio
    socket.emit("startGame", gameCode);
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
                <div className="avatar" style={AVATARS.Blue.style}>
                  <div className="avatarMouth" />
                </div>
                {player.username} {player.isHost && "(host)"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='lobbyBottom'>
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

    </div>
  );
}

export default Lobby;
