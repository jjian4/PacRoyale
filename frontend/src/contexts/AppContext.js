import { createContext } from "react";

const AppContext = createContext({
  goToArena: () => { },
  goToLobby: () => { },
  goToLogin: () => { },
  goToMainMenu: () => { },
  setIsHost: () => { },
  setUser: () => { },
  setIsMusicOn: () => { },
  isHost: false,
  socket: null,
  user: {},
  isUserLoaded: false, // Can't just check if user is empty bc it may be initialized before it loads
  isMusicOn: true,
});

export default AppContext;
