import React from "react";
import { useState, useEffect, useContext } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ARENA_COLORS,
  GAME_MODES,
  POWERUPS,
  WEAKNESSES,
} from "../../utils/constants";
import AppContext from "./../../contexts/AppContext";
import "./GameSettings.scss";

function GameSettings(props) {
  const { socket, goToLobby, setIsHost, user } = useContext(AppContext);

  const [selectedArenaColor, setSelectedArenaColor] = useState(
    ARENA_COLORS.WHITE.name
  );
  const [selectedPowerups, setSelectedPowerups] = useState([
    // POWERUPS.EAT.name,
    // POWERUPS.SPEED.name,
    // POWERUPS.SHOOT.name,
  ]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState([
    // WEAKNESSES.GHOST.name,
  ]);

  const [selectedGameMode, setSelectedGameMode] = useState(
    GAME_MODES.FIRST_TO_100.name
  );

  const [selectedSpawnRate, setSelectedSpawnRate] = useState("medium");

  useEffect(() => {
    socket.on("lobbyCreated", (data) => {
      goToLobby();
      setIsHost(true);
    });
    // eslint-disable-next-line
  }, []);

  const handleCreateLobby = () => {
    console.log(user);
    socket.emit(
      "newGame",
      user.username,
      user.equippedSkin,
      selectedArenaColor,
      selectedPowerups,
      selectedWeaknesses,
      selectedGameMode,
      selectedSpawnRate
    );
  };

  return (
    <div className="GameSettings">
      <div className="form">
        <div className="subtitle">Arena Color</div>

        <div className="arenaChoices">
          {Object.keys(ARENA_COLORS).map((arenaColor, index) => (
            <div
              key={index}
              className={`arenaChoice ${selectedArenaColor === ARENA_COLORS[arenaColor].name &&
                "selectedArenaChoice"
                }`}
              style={ARENA_COLORS[arenaColor].style}
              onClick={() =>
                setSelectedArenaColor(ARENA_COLORS[arenaColor].name)
              }
            >
              {selectedArenaColor === ARENA_COLORS[arenaColor].name && (
                <FontAwesomeIcon icon={faCheck} className="checkMark" />
              )}
            </div>
          ))}
        </div>

        <div className="subtitle">Power-ups</div>

        <div className="powerupChoices">
          {Object.keys(POWERUPS).map((powerup, index) => (
            <div key={index}>
              <div
                className={`powerupChoice ${selectedPowerups.includes(POWERUPS[powerup].name) &&
                  "selectedPowerupChoice"
                  }`}
                onClick={() => {
                  if (selectedPowerups.includes(POWERUPS[powerup].name)) {
                    setSelectedPowerups(
                      selectedPowerups.filter(
                        (item) => item !== POWERUPS[powerup].name
                      )
                    );
                  } else {
                    setSelectedPowerups([
                      ...selectedPowerups,
                      POWERUPS[powerup].name,
                    ]);
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={POWERUPS[powerup].icon}
                  className="powerupIcon"
                />
              </div>
              <div className="powerupDescription">{POWERUPS[powerup].name}</div>
            </div>
          ))}
        </div>

        <div className="subtitle">Weaknesses</div>
        {/* Used same CSS classes as powerups bc lazy */}
        <div className="powerupChoices">
          {Object.keys(WEAKNESSES).map((weakness, index) => (
            <div key={index}>
              <div
                className={`powerupChoice ${selectedWeaknesses.includes(WEAKNESSES[weakness].name) &&
                  "selectedPowerupChoice"
                  }`}
                onClick={() => {
                  if (selectedWeaknesses.includes(WEAKNESSES[weakness].name)) {
                    setSelectedWeaknesses(
                      selectedWeaknesses.filter(
                        (item) => item !== WEAKNESSES[weakness].name
                      )
                    );
                  } else {
                    setSelectedWeaknesses([
                      ...selectedWeaknesses,
                      WEAKNESSES[weakness].name,
                    ]);
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={WEAKNESSES[weakness].icon}
                  className="powerupIcon"
                />
              </div>
              <div className="powerupDescription">
                {WEAKNESSES[weakness].name}
              </div>
            </div>
          ))}
        </div>

        <div className="subtitle">Spawn Rate</div>
        <div className="spawnRates">
          <label>
            <input
              type="radio"
              value={"low"}
              checked={selectedSpawnRate === "low"}
              onChange={(e) => setSelectedSpawnRate(e.target.value)}
            />
            <span htmlFor="low">Low</span>
          </label>
          <label>
            <input
              type="radio"
              value={"medium"}
              checked={selectedSpawnRate === "medium"}
              onChange={(e) => setSelectedSpawnRate(e.target.value)}
            />
            <span htmlFor="medium">Medium</span>
          </label>
          <label>
            <input
              type="radio"
              value={"high"}
              checked={selectedSpawnRate === "high"}
              onChange={(e) => setSelectedSpawnRate(e.target.value)}
            />
            <span htmlFor="high">High</span>
          </label>
        </div>

        <div className="subtitle">Game Mode</div>

        <div className="gameModeChoices">
          {Object.keys(GAME_MODES).map((gameMode, index) => (
            <label key={index} className="gameModeChoice">
              <input
                type="radio"
                value={GAME_MODES[gameMode].name}
                checked={GAME_MODES[gameMode].name === selectedGameMode}
                onChange={(e) => setSelectedGameMode(e.target.value)}
              />
              <span>
                <span className="gameModeName">
                  {GAME_MODES[gameMode].name}:
                </span>{" "}
                {GAME_MODES[gameMode].description}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* TODO: Check props to see if host is editing. If editing, change button text to "Return to Lobby" */}
      <button className="button lobbyButton" onClick={handleCreateLobby}>
        Create Lobby
      </button>
    </div>
  );
}

export default GameSettings;
