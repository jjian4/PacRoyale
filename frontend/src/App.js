import React from "react";
import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
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
import firebase from './utils/firebase';
import SplashScreen from "./pages/SplashScreen/SplashScreen";

function App() {

  // detecting if the user is signed in as async process
  // since we don't want the user to sit at the sign in while Firebase checks if they're
  // signed in or not, we show a splash/loading screen 
  const [currentPage, setCurrentPage] = useState(PAGES.SPLASH_SCREEN);

  // If user is signed in, we redirect to main menu
  // If not, we go to the login page
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setCurrentPage(PAGES.MAIN_MENU)
    } else {
      setCurrentPage(PAGES.LOGIN)
    }
  })

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
    case PAGES.REGISTER:
      page = <Register />;
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
    case PAGES.SPLASH_SCREEN:
      page = <SplashScreen />;
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
          goToRegister: () => {
            setCurrentPage(PAGES.REGISTER);
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
