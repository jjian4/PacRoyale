import React from "react";
import { useState, useContext, useEffect } from "react";
import AppContext from "./../../contexts/AppContext";
import { AVATARS } from "./../../utils/constants";
import "./Lobby.scss";

function Lobby() {
  const { socket, goToMainMenu } = useContext(AppContext);
  useEffect(() => {
    socket.on("hostDisconnect", (data) => {
      goToMainMenu();
    });
  }, []);
  const [players, setPlayers] = useState([
    // TODO: Hard-coded, will remove
    { username: 'jjian', avatar: 'blue', isHost: true },
    { username: 'hawattoo', avatar: 'target' },
    { username: 'jamesxu', avatar: 'navy-stripes' },
  ]);
  const [gameCode, setGameCode] = useState(12345);

  const { isHost, goToArena } = useContext(AppContext);

  const startGame = () => {
    // TODO: Start the game in socketio

    goToArena();
  };

  return (
    <div className="Lobby">
      <div className="title">jjian's Lobby</div>

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
            <div className='col-md-6' key={index}>
              <div className='playerRow'>
                <div
                  className='avatar'
                  style={Object.values(AVATARS).find(avatar => avatar.name === player.avatar).style}
                />
                {player.username} {player.isHost && '(host)'}
              </div>
            </div>
          ))}
        </div>
      </div>

      { isHost && (
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
        <div className="nonHostMessage">
          Waiting for the host to start the game...
        </div>
      )}
    </div>
  );
}

export default Lobby;
