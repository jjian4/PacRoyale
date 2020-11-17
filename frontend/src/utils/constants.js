import {
  faFastForward,
  faGhost,
  faHandScissors,
  faLeaf,
  faPencilAlt,
  faRocket,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

export const SITE_NAME = "493 Battle Royale";

export const PAGES = {
  LOGIN: "login",
  MAIN_MENU: "main_menu",
  LOBBY: "lobby",
  ARENA: "arena",
  MINIGAME: "minigame",
  ABOUT: "about",
  SPLASH_SCREEN: "splash_screen",
};

export const AVATARS = {
  Blue: {
    name: "blue",
    price: 0,
    style: {
      backgroundColor: "blue",
    },
  },
  Red: {
    name: "red",
    price: 0,
    style: {
      backgroundColor: "red",
    },
  },
  Green: {
    name: "green",
    price: 0,
    style: {
      backgroundColor: "green",
    },
  },
  Purple: {
    name: "purple",
    price: 600,
    style: {
      backgroundColor: "purple",
    },
  },
  Gold: {
    name: "gold",
    price: 600,
    style: {
      backgroundColor: "gold",
    },
  },
  "Navy Sripes": {
    name: "navy-stripes",
    price: 1200,
    style: {
      background:
        "repeating-linear-gradient(45deg, darkslateblue, darkslateblue, 10px, navy 10px, navy 20px)",
    },
  },
  "Gray Sripes": {
    name: "gray-stripes",
    price: 1200,
    style: {
      background:
        "repeating-linear-gradient(45deg, lightgray, lightgray, 10px, gray 10px, gray 20px)",
    },
  },
  Target: {
    name: "target",
    price: 2000,
    style: {
      background:
        "repeating-radial-gradient(circle, red, red 15%, whitesmoke 15%, whitesmoke 30%)",
    },
  },
  "Target 2": {
    name: "target2",
    price: 2000,
    style: {
      background:
        "repeating-radial-gradient(circle, blue, red 20%, yellow 20%, yellow 30%)",
    },
  },
  Black: {
    name: "black",
    price: 9000,
    style: {
      backgroundColor: "black",
    },
  },
};

export const ARENA_COLORS = {
  WHITE: {
    name: "white",
    style: { backgroundColor: "white" },
  },
  GRAY: {
    name: "gray",
    style: { backgroundColor: "lightgray" },
  },
  YELLOW: {
    name: "yellow",
    style: { backgroundColor: "lightyellow" },
  },
  PINK: {
    name: "pink",
    style: { backgroundColor: "lightpink" },
  },
  BLUE: {
    name: "blue",
    style: { backgroundColor: "lightblue" },
  },
};

export const POWERUPS = {
  EAT: {
    name: "Eat",
    description:
      "(10 sec): Collide with other players to stun them and steal a coin.",
    icon: faUtensils,
  },
  QUIZ: {
    name: "Quiz",
    description:
      "(on collision): Collide with another player to start a trivia quiz on a topic of your choice. Winner steals 10 coins.",
    icon: faPencilAlt,
  },
  SPEED: {
    name: "Speed",
    description: "(10 sec): Movement speed increases.",
    icon: faFastForward,
  },
  RPS: {
    name: "RPS",
    description:
      "(on collision): Collide with another player to start a rock-paper-scissors game. Winner steals 5 coins.",
    icon: faHandScissors,
  },
  GHOST: {
    name: "Ghost",
    description:
      "(instant): A ghost moves across to arena, stunning and stealing a coin from each opponent it collides with.",
    icon: faGhost,
  },
};

export const TECH_STACK = {
  SOCKETIO: {
    name: "Socket.io",
    description: "Instant communication between server and player clients",
  },
  FIREBASE: {
    name: "Firebase",
    description: "User authentication and database",
  },
  REACT: {
    name: "React.js",
    description: "UI library for reusing components and managing state",
  },
  SASS: {
    name: "Sass",
    description: "CSS preprocessor for neater styling code",
  },
  BOOTSTRAP: {
    name: "Bootstrap",
    description: "UI responsiveness and easier styling",
  },
};

export const firebaseConfig = {
  apiKey: "AIzaSyAIPYSCzBarY45ObEhm8BQu9jAhnIsUcNE",
  authDomain: "final-project-f528e.firebaseapp.com",
  databaseURL: "https://final-project-f528e.firebaseio.com",
  projectId: "final-project-f528e",
  storageBucket: "final-project-f528e.appspot.com",
  messagingSenderId: "312001451038",
  appId: "1:312001451038:web:72f6416555e32201a7ca0f",
  measurementId: "G-F0TLFCPVG2",
};
