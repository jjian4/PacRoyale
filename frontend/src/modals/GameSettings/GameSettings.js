import React from "react";
import { useEffect, useContext } from "react";
import "./GameSettings.scss";
import AppContext from "./../../contexts/AppContext";

function GameSettings() {
  const { socket } = useContext(AppContext);
  const handleCreateLobby = () => {
    socket.emit("newGame");
  };
  useEffect(() => {
    socket.on("gameCode", (data) => {
      console.log(data);
    });
  }, []);
  return (
    <div>
      <button onClick={handleCreateLobby}>Create Lobby</button>
    </div>
  );
}

export default GameSettings;
