import React from "react";
import { useEffect, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faVolumeMute,
  faVolumeUp,
  faGhost,
  faBomb,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import { POWERUPS, ARENA_COLORS } from "../../utils/constants";
import { AVATARS } from "./../../utils/constants";
import AppContext from "./../../contexts/AppContext";
import musicMp3 from "../../sounds/arena-music.mp3";
import powerupMp3 from "../../sounds/powerup.mp3";
import FloatingActionButton from "../../components/Modal/FloatingActionButton/FloatingActionButton";
import "./Arena.scss";

const KEYS = {
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

const music = new Audio(musicMp3);
music.loop = true;
const powerupSound = new Audio(powerupMp3);

function Arena() {
  const { socket, goToMainMenu, isMusicOn, setIsMusicOn, user } = useContext(
    AppContext
  );

  const [gameState, setGameState] = useState(null);
  // Used for setting arena box size
  const [isMobile, setIsMobile] = useState(false);
  // Used for moving leaderboard
  const [isAlmostMobile, setisAlmostMobile] = useState(false);

  // For some reason, audio can't play on safari
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

    // Only allow one gameOver alert (socket.io sends multiple copies)
    let recGameOver = false;
    socket.on("gameOver", (gameOver) => {
      if (!recGameOver) {
        recGameOver = true;
        const { message, score, isWinner } = gameOver;
        user.incrementCoins(score);
        user.incrementGamesPlayed();
        if (isWinner) {
          user.incrementWins();
        }
        alert(message);
        goToMainMenu();
      }
    });
    socket.on("playPowerupSound", () => {
      if (!isSafari && isMusicOn) {
        powerupSound.play();
      }
    });

    return () => {
      window.removeEventListener("resize", resizeArena);
      window.removeEventListener("resize", handleArrowKey);
      music.pause();
      music.currentTime = 0;
    };
    // eslint-disable-next-line
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
  };

  const resizeArena = () => {
    if (window.innerWidth <= window.innerHeight + 200) {
      setisAlmostMobile(true);
    } else {
      setisAlmostMobile(false);
    }
    if (window.innerWidth <= window.innerHeight) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const handleArrowKey = (e) => {
    switch (e.which) {
      case KEYS.space:
      case KEYS.left:
      case KEYS.right:
      case KEYS.up:
      case KEYS.down:
        e.preventDefault();
        socket.emit("keydown", e.which);
        break;
      default:
        break;
    }
  };

  // Game state
  const players = [];
  const foods = [];
  const powerups = [];
  const shots = [];
  const ghosts = [];
  const slows = [];
  const bombs = [];
  const explosions = [];
  const sortedPlayerScores = [];
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
      let marginLeft = -4 * (username.length - 2) + 10;
      players.push(
        <div
          className="playerContainer"
          style={{
            top: value.pos.y + "%",
            left: value.pos.x + "%",
          }}
        >
          <p className="playerName" style={{ marginLeft: marginLeft + "px" }}>
            {username}
          </p>
          <div
            key={username}
            className={`avatar avatar-${value.powerup} ${value.isStunned ? "stunnedPlayer" : ""
              }`}
            style={{
              ...AVATARS[value.equippedSkin].style,
              transform: "rotate(" + rotateDeg + "deg)",
            }}
          >
            <div
              className="avatarMouth"
              style={
                gameState &&
                Object.values(ARENA_COLORS).find(
                  (x) => x.name === gameState.arenaColor
                ).style
              }
            />
          </div>
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
          className={`powerup powerup-${powerup.name}`}
          key={"powerup" + idx}
          style={{ top: powerup.y + "%", left: powerup.x + "%" }}
        >
          <FontAwesomeIcon
            icon={
              Object.values(POWERUPS).find((x) => x.name === powerup.name)?.icon
            }
            className="powerupIcon"
          />
        </div>
      );
    });
    gameState.shots.forEach((shot, idx) => {
      shots.push(
        <div
          className="shot"
          key={"shot" + idx}
          style={{ top: shot.pos.y + "%", left: shot.pos.x + "%" }}
        ></div>
      );
    });
    gameState.ghosts.forEach((ghost, idx) => {
      ghosts.push(
        <div
          className="ghost"
          key={"ghost" + idx}
          style={{ top: ghost.pos.y + "%", left: ghost.pos.x + "%" }}
        >
          <FontAwesomeIcon icon={faGhost} className="ghostIcon" />
        </div>
      );
    });
    gameState.slows.forEach((slow, idx) => {
      slows.push(
        <FontAwesomeIcon
          className="slow"
          key={"slow" + idx}
          icon={faSnowflake}
          style={{
            top: slow.pos.y + "%",
            left: slow.pos.x + "%",
            width: slow.size + "%",
            height: slow.size + "%",
          }}
        />
      );
    });
    gameState.bombs.forEach((bomb, idx) => {
      bombs.push(
        <div
          className="bomb"
          key={"bomb" + idx}
          style={{
            top: bomb.pos.y + "%",
            left: bomb.pos.x + "%",
          }}
        >
          <FontAwesomeIcon
            icon={faBomb}
            className="bombIcon"
            style={{ color: `rgb(${0.01 * bomb.percentage * 255},0,0)` }}
          />
        </div>
      );
    });
    gameState.explosions.forEach((explosion, idx) => {
      explosions.push(
        <div
          className="explosion"
          key={"explosion" + idx}
          style={{
            top: explosion.pos.y + "%",
            left: explosion.pos.x + "%",
            width: explosion.size + "%",
            height: explosion.size + "%",
          }}
        >
          <div
            className="explosionFire"
            style={{
              top: 0,
              left: 0,
              width: "50%",
              height: "50%",
            }}
          />
          <div
            className="explosionFire"
            style={{
              top: "50%",
              left: 0,
              width: "50%",
              height: "50%",
            }}
          />
          <div
            className="explosionFire"
            style={{
              top: 0,
              left: "50%",
              width: "50%",
              height: "50%",
            }}
          />
          <div
            className="explosionFire"
            style={{
              top: "50%",
              left: "50%",
              width: "50%",
              height: "50%",
            }}
          />
        </div>
      );
    });

    Object.keys(gameState.players).forEach((username) => {
      sortedPlayerScores.push([gameState.players[username].score, username]);
    });
    sortedPlayerScores.sort((a, b) => b[0] - a[0]);
  }

  return (
    <div className={`Arena ${isAlmostMobile ? "Arena-vertical" : ""}`}>
      <div
        className={`arenaBox ${isMobile ? "arenaBox-mobile" : ""}`}
        style={
          gameState &&
          Object.values(ARENA_COLORS).find(
            (x) => x.name === gameState.arenaColor
          ).style
        }
      >
        {players}
        {foods}
        {powerups}
        {shots}
        {ghosts}
        {slows}
        {bombs}
        {explosions}
      </div>
      <div
        className="gameInfo"
        style={{ width: isAlmostMobile ? "90%" : "auto" }}
      >
        {gameState && (
          <>
            <div
              className="gameMode"
              style={{
                display: isAlmostMobile ? "flex" : "block",
                justifyContent: isAlmostMobile ? "center" : "auto",
              }}
            >
              <div>
                {gameState.selectedGameMode}
                {gameState.eliminationTimer != null && isAlmostMobile
                  ? ":"
                  : ""}
              </div>
              <div>
                {gameState.eliminationTimer != null && (
                  <div className="gameTimer">{gameState.eliminationTimer}</div>
                )}
              </div>
            </div>

            <div className="leaderboardTitle">Leaderboard</div>
            <div className={`${isAlmostMobile ? "row" : ""}`}>
              {sortedPlayerScores.map((scoreAndUsername) => (
                <div
                  className={`playerInfo ${isAlmostMobile ? "col-sm-4 col-6" : ""
                    }`}
                >
                  <div className="playerUsernameAvatar">
                    <div
                      className="avatar"
                      style={
                        AVATARS[
                          gameState.players[scoreAndUsername[1]].equippedSkin
                        ].style
                      }
                    >
                      <div className="avatarMouth" />
                    </div>
                    {scoreAndUsername[1]}:
                  </div>
                  <div>{scoreAndUsername[0]}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bottomRight">
        <FloatingActionButton
          title="Music"
          onClick={toggleMusic}
          icon={isMusicOn ? faVolumeUp : faVolumeMute}
        />
        {/* TODO: Send message to socketio to leave game */}
        <FloatingActionButton
          title="Exit"
          onClick={() => {
            console.log("TODO: Leave game");
          }}
          icon={faSignOutAlt}
        />
      </div>
    </div>
  );
}

export default Arena;
