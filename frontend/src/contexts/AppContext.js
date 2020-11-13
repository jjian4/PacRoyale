import { createContext } from "react";
import User from "../utils/user";

const AppContext = createContext({
  goToArena: () => {},
  goToLobby: () => {},
  goToLogin: () => {},
  goToMainMenu: () => {},
  setIsHost: () => {},
  setUser: () => {},
  isHost: false,
  socket: null,
  user: new User({ username: '', uid: {} }),
});

export default AppContext;
