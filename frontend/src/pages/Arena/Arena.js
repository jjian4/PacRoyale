import React from "react";
import { useEffect, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { POWERUPS } from "../../utils/constants";
import { AVATARS } from "./../../utils/constants";
import AppContext from "./../../contexts/AppContext";
import musicMp3 from "../../sounds/arena-music.mp3";
import powerupMp3 from "../../sounds/powerup.mp3";
import "./Arena.scss";
import FloatingActionButton from "../../components/Modal/FloatingActionButton/FloatingActionButton";

const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

const music = new Audio(musicMp3);
music.loop = true;
const powerupSound = new Audio(powerupMp3);


function Arena() {
  const { socket, goToMainMenu, isMusicOn, setIsMusicOn } = useContext(AppContext);

  const [gameState, setGameState] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // For some reaosn, audio can't play on safari
  const isSafari = window.safari !== undefined;

  useEffect(() => {
    // Keep arena window a square even on mobile views
    window.addEventListener("resize", resizeArena);
    resizeArena();

    // Arrow key listener
    window.addEventListener("keydown", handleArrowKey);

    if (!isSafari && isMusicOn) {
      music.play();
    }

    socket.on("gameState", (data) => {
      console.log(JSON.parse(data));
      setGameState(JSON.parse(data));
    });
    socket.on("gameOver", (data) => {
      const gameOver = JSON.parse(data);
      alert(gameOver.winner + " has won the game!!!");
      goToMainMenu();
    });
    socket.on("playPowerupSound", () => {
      if (!isSafari) {
        powerupSound.play();
      }
    });

    return () => {
      window.removeEventListener("resize", resizeArena);
      window.removeEventListener("resize", handleArrowKey);
      music.pause();
      music.currentTime = 0;
    };

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
  }

  const resizeArena = () => {
    if (window.innerWidth <= window.innerHeight) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };


  const handleArrowKey = (e) => {
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
  };


  // Game state
  console.log(gameState);
  const players = [];
  const foods = [];
  const powerups = [];
  if (gameState) {
    for (const [username, value] of Object.entries(gameState.players)) {
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
      console.log(value.powerup);
      players.push(
        <div
          key={username}
          className={`player avatar ${value.powerup}`}
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
    gameState.foods.forEach((food, idx) => {
      foods.push(
        <div
          className="food"
          key={"food" + idx}
          style={{ top: food.y + "%", left: food.x + "%" }}
        ></div>
      );
    });
    gameState.powerups.forEach((powerup, idx) => {
      powerups.push(
        <div
          className="powerup"
          key={"powerup" + idx}
          style={{ top: powerup.y + "%", left: powerup.x + "%" }}
        >
          <FontAwesomeIcon
            icon={POWERUPS[powerup.type].icon}
            className="powerupIcon"
          />
        </div>
      );
    });
  }


  return (
    <div className={`Arena ${isMobile && "Arena-mobile"}`}>
      <div className="arenaBox">
        {players}
        {foods}
        {powerups}
      </div>
      <div className="leaderboard">
        <div className="leaderboardTitle">Leaderboard (? alive)</div>
        {gameState &&
          Object.keys(gameState.players).map((username) => (
            <div className="playerInfo">
              <div>
                {username} ({gameState.players[username].score}coins)
              </div>
              <div className="healthBar">
                <div
                  className="innerHealthBar"
                  style={{
                    width: `calc(100% * ${gameState.players[username].score * 0.01
                      })`,
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      <div className='bottomRight'>
        <FloatingActionButton
          title='Music'
          onClick={toggleMusic}
          icon={isMusicOn ? faVolumeUp : faVolumeMute}
        />
        {/* TODO: Send message to socketio to leave game */}
        <FloatingActionButton
          title='Exit'
          onClick={() => { console.log('TODO: Leave game') }}
          icon={faSignOutAlt}
        />
      </div>
    </div>
  );
}

export default Arena;
