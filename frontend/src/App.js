import React from "react";
import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import MainMenu from "./pages/MainMenu/MainMenu";
import Lobby from "./pages/Lobby/Lobby";
import Arena from "./pages/Arena/Arena";
import "./App.scss";
import { PAGES } from "./utils/constants";
import io from "socket.io-client";
import AppContext from "./contexts/AppContext";

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.LOGIN);
  const [isHost, setStateIsHost] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.on("init", (data) => {
      console.log(data);
    });
  }, []);
  let page = null;
  switch (currentPage) {
    case PAGES.LOGIN:
      page = <Login />;
      break;
    case PAGES.MAIN_MENU:
      page = <MainMenu />;
      break;
    case PAGES.LOBBY:
      page = <Lobby />;
      break;
    case PAGES.ARENA:
      page = <Arena />;
      break;
    default:
      break;
  }
  return (
    <div>
      <AppContext.Provider
        value={{
          goToArena: () => {
            setCurrentPage(PAGES.ARENA);
          },
          goToLobby: () => {
            setCurrentPage(PAGES.LOBBY);
          },
          goToLogin: () => {
            setCurrentPage(PAGES.LOGIN);
          },
          goToMainMenu: () => {
            setCurrentPage(PAGES.MAIN_MENU);
          },
          setIsHost: (isHost) => {
            setStateIsHost(isHost);
          },
          isHost: isHost,
        }}
      >
        {page}
      </AppContext.Provider>
    </div>
  );
}

export default App;
