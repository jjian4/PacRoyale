import { createContext } from "react";

const AppContext = createContext({
  goToArena: () => {},
  goToLobby: () => {},
  goToLogin: () => {},
  goToMainMenu: () => {},
  setIsHost: () => {},
  isHost: false,
  socket: null,
});

export default AppContext;
