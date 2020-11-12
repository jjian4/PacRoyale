import React from "react";
import { useEffect, useContext } from "react";
import "./GameSettings.scss";
import AppContext from "./../../contexts/AppContext";

function GameSettings() {
  const { socket, goToLobby, setIsHost, username } = useContext(AppContext);
  const handleCreateLobby = () => {
    socket.emit("newGame", username); //TODO: Update username
  };
  useEffect(() => {
    socket.on("lobbyCreated", (data) => {
      goToLobby();
      setIsHost(true);
    });
  }, []);
  return (
    <div>
      <button onClick={handleCreateLobby}>Create Lobby</button>
    </div>
  );
}

export default GameSettings;
