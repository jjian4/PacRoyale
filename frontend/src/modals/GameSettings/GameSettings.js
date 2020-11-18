import React from "react";
import { useState, useEffect, useContext } from "react";
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ARENA_COLORS, GAME_MODES, POWERUPS } from "../../utils/constants"
import AppContext from "./../../contexts/AppContext";
import "./GameSettings.scss";

function GameSettings(props) {
  const { socket, goToLobby, setIsHost, user } = useContext(AppContext);

  const [selectedArenaColor, setSelectedArenaColor] = useState(ARENA_COLORS.WHITE.name);
  const [selectedPowerups, setSelectedPowerups] = useState([POWERUPS.EAT.name, POWERUPS.SPEED.name, POWERUPS.SHOOT.name]);
  // const [quizDuration, setQuizDuration] = useState("10");
  const [selectedGameMode, setSelectedGameMode] = useState(GAME_MODES.ELIMINATION.name);

  useEffect(() => {
    socket.on("lobbyCreated", (data) => {
      goToLobby();
      setIsHost(true);
    });
  }, []);


  const handleCreateLobby = () => {
    // // First check that quizDuration input is valid
    // const parsedQuizDuration = parseInt(quizDuration);
    // if (isNaN(parsedQuizDuration) || parsedQuizDuration < 8 || parsedQuizDuration > 20) {
    //   alert('Quiz duration must be a number between 8 and 20.')
    //   return;
    // }

    console.log(user.username);
    socket.emit("newGame", user.username); //TODO: Update username
  };


  return (
    <div className='GameSettings'>

      <div className='form'>
        <div className='subtitle'>
          Arena Color
        </div>

        <div className='arenaChoices'>
          {Object.keys(ARENA_COLORS).map((arenaColor, index) => (
            <div
              key={index}
              className={`arenaChoice ${selectedArenaColor === ARENA_COLORS[arenaColor].name && 'selectedArenaChoice'}`}
              style={ARENA_COLORS[arenaColor].style}
              onClick={() => setSelectedArenaColor(ARENA_COLORS[arenaColor].name)}
            >
              {selectedArenaColor === ARENA_COLORS[arenaColor].name && (
                <FontAwesomeIcon icon={faCheck} className='checkMark' />
              )}
            </div>
          ))}
        </div>

        <div className='subtitle'>
          Power-ups
        </div>

        <div className='powerupChoices'>
          {Object.keys(POWERUPS).map((powerup, index) => (
            <div key={index}>
              <div
                className={`powerupChoice ${selectedPowerups.includes(POWERUPS[powerup].name) && 'selectedPowerupChoice'}`}
                onClick={() => {
                  if (selectedPowerups.includes(POWERUPS[powerup].name)) {
                    setSelectedPowerups(selectedPowerups.filter(item => item !== POWERUPS[powerup].name));
                  } else {
                    setSelectedPowerups([...selectedPowerups, POWERUPS[powerup].name]);
                  }
                }}
              >
                <FontAwesomeIcon icon={POWERUPS[powerup].icon} className='powerupIcon' />
              </div>
              <div className='powerupDescription'>{POWERUPS[powerup].name}</div>
            </div>
          ))}
        </div>

        {/* <div className='subtitle'>
          Quiz Duration
          <div className='quizDurationDescription'>(Between 8 and 20 seconds)</div>
        </div>

        <div className='quizDurationRow'>
          <input
            className='quizDurationInput'
            type='number'
            value={quizDuration}
            onChange={e => setQuizDuration(e.target.value)}
          /> sec
        </div> */}


        <div className='subtitle'>
          Game Mode
        </div>

        <div className='gameModeChoices'>
          {Object.keys(GAME_MODES).map((gameMode, index) => (
            <label key={index} className='gameModeChoice'>
              <input
                type='radio'
                value={GAME_MODES[gameMode].name}
                checked={GAME_MODES[gameMode].name === selectedGameMode}
                onChange={e => setSelectedGameMode(e.target.value)}
              />
              <span className='gameModeName'>{GAME_MODES[gameMode].name}:</span>
              <span className='gameModeDescription'>{GAME_MODES[gameMode].description}</span>
            </label>
          ))}
        </div>

      </div>

      {/* TODO: Check props to see if host is editing. If editing, change button text to "Return to Lobby" */}
      <button className='button lobbyButton' onClick={handleCreateLobby}>Create Lobby</button>
    </div>
  );
}

export default GameSettings;
