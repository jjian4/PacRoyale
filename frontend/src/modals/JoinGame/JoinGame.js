import React from "react";
import { useState, useEffect, useContext } from "react";
import "./JoinGame.scss";
import AppContext from "./../../contexts/AppContext";

function JoinGame() {
  const { socket, username } = useContext(AppContext);
  const [gameCode, setGameCode] = useState("");
  const [activeGames, setActiveGames] = useState([]);
  useEffect(() => {
    socket.emit("getRooms");
    socket.on("rooms", (data) => {
      console.log(data);
      setActiveGames(JSON.parse(data));
    });
    socket.on("unknownCode", () => {
      alert("Unknown game code");
    });
    socket.on("tooManyPlayers", () => {
      alert("Too many players");
    });
  }, []);
  const handleJoinGame = () => {
    setGameCode("");
    socket.emit("joinGame", username);
  };
  return (
    <div className="JoinGame">
      <input onChange={setGameCode} placeholder="Enter a game code" />
      <button onClick={handleJoinGame}>Join Game</button>
      <h4>Active Games:</h4>
      {activeGames.map((game, idx) => (
        <p key={game.host + idx}>{game.host}</p>
      ))}
    </div>
  );
}

export default JoinGame;
