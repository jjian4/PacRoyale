import React from "react";
import { useState, useEffect, useContext } from "react";
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ARENA_COLORS, POWERUPS } from "../../utils/constants"
import AppContext from "./../../contexts/AppContext";
import "./GameSettings.scss";

function GameSettings(props) {
  const [selectedArenaColor, setSelectedArenaColor] = useState(ARENA_COLORS.WHITE.name);
  const [selectedPowerups, setSSelectedPowerups] = useState([POWERUPS.EAT.name, POWERUPS.QUIZ.name]);
  const [quizDuration, setQuizDuration] = useState("10");

  const { socket, goToLobby, setIsHost, user } = useContext(AppContext);
  const handleCreateLobby = () => {
    // First check that input is valid
    const parsedQuizDuration = parseInt(quizDuration);
    if (isNaN(parsedQuizDuration) || parsedQuizDuration < 8 || parsedQuizDuration > 20) {
      alert('Quiz duration must be a number between 8 and 20.')
      return;
    }

    console.log(user.username);
    socket.emit("newGame", user.username); //TODO: Update username
  };
  useEffect(() => {
    socket.on("lobbyCreated", (data) => {
      goToLobby();
      setIsHost(true);
    });
  }, []);
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
            <div>
              <div
                key={index}
                className={`powerupChoice ${selectedPowerups.includes(POWERUPS[powerup].name) && 'selectedPowerupChoice'}`}
                onClick={() => {
                  if (selectedPowerups.includes(POWERUPS[powerup].name)) {
                    setSSelectedPowerups(selectedPowerups.filter(item => item !== POWERUPS[powerup].name));
                  } else {
                    setSSelectedPowerups([...selectedPowerups, POWERUPS[powerup].name]);
                  }
                }}
              >
                <FontAwesomeIcon icon={POWERUPS[powerup].icon} className='powerupIcon' />
              </div>
              <div className='powerupDescription'>{POWERUPS[powerup].name}</div>
            </div>
          ))}
        </div>

        <div className='subtitle'>
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
        </div>

      </div>

      {/* TODO: Check props to see if host is editting. If editting, change button text to "Return to Lobby" */}
      <button className='button lobbyButton' onClick={handleCreateLobby}>Create Lobby</button>
    </div>
  );
}

export default GameSettings;
