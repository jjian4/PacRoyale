import React from "react";
import { useEffect, useContext, useState } from "react";
import { AVATARS } from "./../../utils/constants";
import AppContext from "./../../contexts/AppContext";
import "./Arena.scss";

const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

const testLeaderboard = {
  jjian: {
    numWins: 3,
    health: 40,
  },
  hawatto: {
    numWins: 2,
    health: 50,
  },
  jamesxu: {
    numWins: 1,
    health: 60,
  },
};

function Arena() {
  const { socket } = useContext(AppContext);
  const [gameState, setGameState] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    socket.on("gameState", (data) => {
      setGameState(JSON.parse(data));
    });

    // Keep arena window a square even on mobile views
    window.addEventListener("resize", resizeArena);
    resizeArena();

    // Arrow key listener
    window.addEventListener("keydown", handleArrowKey);

    return () => {
      window.removeEventListener("resize", resizeArena);
      window.removeEventListener("resize", handleArrowKey);
    };

  }, []);

  const resizeArena = () => {
    if (window.innerWidth <= window.innerHeight) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  const handleArrowKey = e => {
    console.log(e.which);
    switch (e.which) {
      case KEYS.left:
        e.preventDefault();
        socket.emit("keydown", KEYS.left);
        break;
      case KEYS.right:
        e.preventDefault();
        socket.emit("keydown", KEYS.right);
        break;
      case KEYS.up:
        e.preventDefault();
        socket.emit("keydown", KEYS.up);
        break;
      case KEYS.down:
        e.preventDefault();
        socket.emit("keydown", KEYS.down);
        break;
      default:
        break;
    }
  }

  // Game state
  console.log(gameState);
  const players = [];
  if (gameState) {
    for (const [username, value] of Object.entries(gameState.players)) {
      console.log(value);
      let rotateDeg;
      if (value.vel.x > 0) {
        rotateDeg = 0;
      } else if (value.vel.x < 0) {
        rotateDeg = 180;
      } else if (value.vel.y > 0) {
        rotateDeg = 90;
      } else if (value.vel.y < 0) {
        rotateDeg = 270;
      }
      players.push(
        <div
          className="player avatar"
          style={{
            ...AVATARS.Blue.style,
            top: value.pos.y + "%",
            left: value.pos.x + "%",
            transform: "rotate(" + rotateDeg + "deg)",
          }}
        >
          <div className="avatarMouth" />
        </div>
      );
    }
  }

  return (
    <div className={`Arena ${isMobile && 'Arena-mobile'}`}>
      <div className="arenaBox">{players}</div>
      <div className="leaderboard">
        <div className="leaderboardTitle">Leaderboard (? alive)</div>
        {Object.keys(testLeaderboard).map((username) => (
          <div className="playerInfo">
            <div>
              {username} ({testLeaderboard[username].numWins} win
              {testLeaderboard[username].numWins !== 1 && "s"})
            </div>
            <div className="healthBar">
              <div
                className="innerHealthBar"
                style={{
                  width: `calc(100% * 0.${testLeaderboard[username].health})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Arena;
