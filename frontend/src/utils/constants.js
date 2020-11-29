import {
  faBolt,
  faFastForward,
  faGhost,
  faUtensils,
  faBomb,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";

export const SITE_NAME = "Pac Royale";

export const PAGES = {
  LOGIN: "login",
  MAIN_MENU: "main_menu",
  LOBBY: "lobby",
  ARENA: "arena",
  MINIGAME: "minigame",
  ABOUT: "about",
  SPLASH_SCREEN: "splash_screen",
};

export const PLAYER_STATS = {
  dateJoined: "Date Joined",
  lastLogin: "Last Login",
  gamesPlayed: "Games Played",
  gamesHosted: "Games Hosted",
  gamesWon: "Games Won",
  totalCoins: "Total Coins",
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
  "Red Sripes": {
    name: "red-stripes",
    price: 1200,
    style: {
      background:
        "repeating-linear-gradient(90deg, red, red, 20%, lightpink 20%, lightpink 40%)",
    },
  },
  "Navy Sripes": {
    name: "navy-stripes",
    price: 1200,
    style: {
      background:
        "repeating-linear-gradient(45deg, darkslateblue, darkslateblue, 20%, navy 20%, navy 40%)",
    },
  },
  "Gray Sripes": {
    name: "gray-stripes",
    price: 1200,
    style: {
      background:
        "repeating-linear-gradient(0deg, lightgray, lightgray, 20%, gray 20%, gray 40%)",
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
  Belgium: {
    name: "belgium",
    price: 1200,
    style: {
      background:
        "linear-gradient(90deg, black 0, black 33%, #fdda24 33%, #fdda24 66%, #ef3340 66%, #ef3340 100%)",
    },
  },
  "Red Eye": {
    name: "red-eye",
    price: 5000,
    style: {
      background: "radial-gradient(red 30%, black 3px)",
    },
  },
  "Pink Eye": {
    name: "pink-eye",
    price: 5000,
    style: {
      background: "radial-gradient(pink 30%, black 3px)",
    },
  },
  Black: {
    name: "black",
    price: 11000,
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
      "(5 sec) Collide with other players to stun them and steal a coin.",
    icon: faUtensils,
  },
  SPEED: {
    name: "Speed",
    description: "(5 sec) Move twice as fact to collect more coins!",
    icon: faFastForward,
  },
  SHOOT: {
    name: "Shoot",
    description:
      "(press space) Shoot a projectile in a straight line, stunning and stealing a coin from each opponent that was hit.",
    icon: faBolt,
  },
};

export const WEAKNESSES = {
  GHOST: {
    name: "Ghost",
    description:
      "Ghosts periodically move across to arena, stunning players and causing them to drop 2 coins.",
    icon: faGhost,
  },
  BOMB: {
    name: "Bomb",
    description:
      "Bombs spawn periodically and explode in a t-shape if a player collides with it.",
    icon: faBomb,
  },
  SLOW: {
    name: "Slow",
    description:
      "Patches of snow will spawn on the arena, slowing down players in the area.",
    icon: faSnowflake,
  },
};

export const GAME_MODES = {
  FIRST_TO_100: {
    name: "First to 100",
    description: "The first player to reach 100 coins wins.",
  },
  ELIMINATION: {
    name: "Elimination",
    description:
      "The player with the least coins is eliminated every 30 seconds. Last player standing wins.",
  },
  SURVIVAL: {
    name: "Survival",
    description:
      "Players are eliminated when they reach 0 coins. The effects of all weaknesses are doubled. Last player standing wins.",
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
