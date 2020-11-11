import { createContext } from "react";

const PageTransitionContext = createContext({
  goToArena: () => { },
  goToLobby: () => { },
  goToLogin: () => { },
  goToMainMenu: () => { },
});

export default PageTransitionContext;
