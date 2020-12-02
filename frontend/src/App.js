import React from "react";
import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import MainMenu from "./pages/MainMenu/MainMenu";
import Lobby from "./pages/Lobby/Lobby";
import Arena from "./pages/Arena/Arena";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { PAGES } from "./utils/constants";
import firebase from "./utils/firebase";
import User from "./utils/user";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import AppContext from "./contexts/AppContext";
import FloatingActionButton from "./components/Modal/FloatingActionButton/FloatingActionButton";
import musicMp3 from "./sounds/menu-music.mp3";
import "./App.scss";

import io from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket", "polling", "flashsocket"],
});

const music = new Audio(musicMp3);
music.loop = true;

function App() {
  // detecting if the user is signed in is async
  // since we don't want the user to sit at the sign in while Firebase checks if they're
  // signed in or not, we show a splash/loading screen
  const [currentPage, setCurrentPage] = useState(PAGES.SPLASH_SCREEN);
  const [isHost, setStateIsHost] = useState(false);
  const [user, setStateUser] = useState(new User({ uid: "" }));
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);

  // For some reason, audio can't play on safari
  const isSafari = window.safari !== undefined;

  // If user is signed in, we redirect to main menu
  // If not, we go to the login page
  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // if the user is logged in, retrieve his info
        let newUser = new User(firebaseUser);
        newUser.getFirebaseData(() => {
          setStateUser(newUser);
          setIsUserLoaded(true);
        });
        setCurrentPage(PAGES.MAIN_MENU);
      } else {
        setCurrentPage(PAGES.LOGIN);
      }
    });

    if (!isSafari && isMusicOn) {
      music.play();
    }
    return () => {
      music.pause();
      music.currentTime = 0;
    };
    // eslint-disable-next-line
  }, []);

  const toggleMusic = () => {
    if (isSafari) {
      return;
    }
    if (isMusicOn) {
      music.pause();
    } else {
      music.play();
    }
    setIsMusicOn(!isMusicOn);
  };

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
            // The arena has different music
            music.pause();
            music.currentTime = 0;
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
            setStateUser(user);
          },
          setIsMusicOn: (isMusicOn) => {
            setIsMusicOn(isMusicOn);
          },
          isHost: isHost,
          socket,
          user: user,
          isUserLoaded: isUserLoaded,
          isMusicOn: isMusicOn,
        }}
      >
        {page}
        {/* Arena has different music and different bottomRight layout */}
        {currentPage !== PAGES.ARENA && (
          <div className="bottomRight">
            <FloatingActionButton
              title="Music"
              onClick={toggleMusic}
              icon={isMusicOn ? faVolumeUp : faVolumeMute}
            />{" "}
          </div>
        )}
      </AppContext.Provider>
    </div>
  );
}

export default App;
