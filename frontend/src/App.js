import React from "react";
import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import MainMenu from "./pages/MainMenu/MainMenu";
import Lobby from "./pages/Lobby/Lobby";
import Arena from "./pages/Arena/Arena";
import Store from "./pages/Store/Store";
import Minigame from "./pages/Minigame/Minigame";
import About from "./pages/About/About";
import "./App.scss";
import { PAGES } from "./utils/constants";
import io from "socket.io-client";
import PageTransitionContext from "./contexts/PageTransitionContext";

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.LOGIN);
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
    case PAGES.STORE:
      page = <Store />;
      break;
    case PAGES.LOBBY:
      page = <Lobby />;
      break;
    case PAGES.ARENA:
      page = <Arena />;
      break;
    case PAGES.MINIGAME:
      page = <Minigame />;
      break;
    case PAGES.ABOUT:
      page = <About />;
      break;
    default:
      break;
  }
  return (
    <div>
      <PageTransitionContext.Provider
        value={{
          goToAbout: () => {
            setCurrentPage(PAGES.ABOUT);
          },
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
          goToMinigame: () => {
            setCurrentPage(PAGES.MINIGAME);
          },
          goToStore: () => {
            setCurrentPage(PAGES.STORE);
          },
        }}
      >
        {page}
      </PageTransitionContext.Provider>
    </div>
  );
}

export default App;
