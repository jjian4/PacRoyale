import React from "react";
import { useEffect, useContext } from "react";
import "./Lobby.scss";
import AppContext from "./../../contexts/AppContext";

function Lobby() {
  const { socket, goToMainMenu } = useContext(AppContext);
  useEffect(() => {
    socket.on("hostDisconnect", (data) => {
      goToMainMenu();
    });
  }, []);
  return (
    <div>
      Lobby{" "}
      <button
        onClick={() => {
          socket.emit("playerDisconnect");
        }}
      >
        Quit Lobby
      </button>
    </div>
  );
}

export default Lobby;
