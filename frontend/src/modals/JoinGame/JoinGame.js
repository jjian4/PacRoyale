import React from "react";
import { useState, useEffect, useContext } from "react";
import "./JoinGame.scss";
import AppContext from "./../../contexts/AppContext";

function JoinGame() {
  const { socket } = useContext(AppContext);
  const [gameCode, setGameCode] = useState("");
  const [activeGames, setActiveGames] = useState({});
  useEffect(() => {
    socket.emit("getRooms");
    socket.on("rooms", (data) => {
      console.log(data);
      setActiveGames(JSON.parse(data));
    });
  }, []);
  const handleJoinGame = () => {
    setGameCode("");
    socket.emit("joinGame", "James");
  };
  const games = [];
  for (const key of Object.keys(activeGames)) {
    games.push(<p>{key}</p>);
  }
  return (
    <div className="JoinGame">
      <input onChange={setGameCode} placeholder="Enter a game code" />
      <button onClick={handleJoinGame}>Join Game</button>
      <h4>Active Games:</h4>
      {games}
    </div>
  );
}

export default JoinGame;
