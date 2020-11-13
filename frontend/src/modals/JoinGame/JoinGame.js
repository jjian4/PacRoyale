import React from "react";
import { useState, useEffect, useContext } from "react";
import AppContext from "./../../contexts/AppContext";
import { AVATARS } from "../../utils/constants";
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
  }, []);

  const onClickJoinGame = (gameCode) => {
    socket.emit("joinGame", gameCode, user.username);
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
          >
            {/* TODO: include game code */}
            <span className="gameRowLeft">
              {/* TODO: get avatar name from database */}
              <div className="avatar" style={AVATARS.Blue.style}>
                <div className="avatarMouth" />
              </div>
              <div>
                <b>{game.host}'s Arena</b> ({game.gameCode})
              </div>
            </span>
            <span>{game.numPlayers}/20 players</span>
          </div>
        ))}
    </div>
  );
}

export default JoinGame;
