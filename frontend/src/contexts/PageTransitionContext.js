import { createContext } from "react";

const PageTransitionContext = createContext({
  goToArena: () => {},
  goToLobby: () => {},
  goToLogin: () => {},
  goToMainMenu: () => {},
  goToMinigame: () => {},
  goToRegister: () => {},
  goToStore: () => {},
});

export default PageTransitionContext;
