import { createContext } from "react";

const PageTransitionContext = createContext({
  goToArena: () => { },
  goToLobby: () => { },
  goToLogin: () => { },
  goToMainMenu: () => { },
  goToMinigame: () => { },
  goToStore: () => { },
});

export default PageTransitionContext;
