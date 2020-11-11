import React from "react";
import { useState } from "react";
import Login from "./pages/Login/Login";
import MainMenu from "./pages/MainMenu/MainMenu";
import Lobby from "./pages/Lobby/Lobby";
import Arena from "./pages/Arena/Arena";
import "./App.scss";
import { PAGES } from "./utils/constants";
import firebase from "./utils/firebase";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import AppContext from "./contexts/AppContext";
import io from "socket.io-client";

function App() {
  // detecting if the user is signed in is async
  // since we don't want the user to sit at the sign in while Firebase checks if they're
  // signed in or not, we show a splash/loading screen
  const [currentPage, setCurrentPage] = useState(PAGES.MAIN_MENU);

  // If user is signed in, we redirect to main menu
  // If not, we go to the login page
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // TODO: If user is in lobby
      if (false) {
        setCurrentPage(PAGES.LOBBY);
      }
      // TODO: If user is still in a game
      else if (false) {
        setCurrentPage(PAGES.ARENA);
      }
      else {
        setCurrentPage(PAGES.MAIN_MENU);
      }

    } else {
      setCurrentPage(PAGES.LOGIN);
    }
  });

  const [isHost, setStateIsHost] = useState(false);
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
    case PAGES.SPLASH_SCREEN:
      page = <SplashScreen />;
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
          socket: io("http://localhost:3001", {
            transports: ["websocket", "polling", "flashsocket"],
          }),
        }}
      >
        {page}
      </AppContext.Provider>
    </div>
  );
}

export default App;
