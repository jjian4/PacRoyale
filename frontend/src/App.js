import React from "react";
import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import MainMenu from "./pages/MainMenu/MainMenu";
import Lobby from "./pages/Lobby/Lobby";
import Arena from "./pages/Arena/Arena";
import "./App.scss";
import { PAGES } from "./utils/constants";
import firebase from "./utils/firebase";
import User from "./utils/user";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import AppContext from "./contexts/AppContext";
import io from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling", "flashsocket"],
});

function App() {
  // detecting if the user is signed in is async
  // since we don't want the user to sit at the sign in while Firebase checks if they're
  // signed in or not, we show a splash/loading screen
  const [currentPage, setCurrentPage] = useState(PAGES.SPLASH_SCREEN);
  const [isHost, setStateIsHost] = useState(false);
  const [user, setUser] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false);

  // If user is signed in, we redirect to main menu
  // If not, we go to the login page
  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // if the user is logged in, retrieve his info
        setCurrentPage(PAGES.MAIN_MENU);
        let newUser = new User(firebaseUser);
        newUser.getFirebaseData();
        setUser(newUser);
      } else {
        setCurrentPage(PAGES.LOGIN);
      }
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
          setUser: (user) => {
            setUser(user);
          },
          setIsMusicOn: (isMusicOn) => {
            setIsMusicOn(isMusicOn);
          },
          isHost: isHost,
          socket,
          user,
          isMusicOn: isMusicOn,
        }}
      >
        {page}
      </AppContext.Provider>
    </div>
  );
}

export default App;
