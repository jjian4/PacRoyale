import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  POWERUPS,
  WEAKNESSES,
  SITE_NAME,
  TECH_STACK,
} from "./../../utils/constants";
import "./About.scss";

function About() {
  return (
    <div className="About">
      <div className="description">
        {SITE_NAME} is an online real-time multiplayer game where up to 20
        players compete in an arena by collecting and attempting to retain coins
        until one player is left.
      </div>

      <div className="howToPlay">
        <div className="title">How to Play</div>

        <div className="subtitle">Hosting a game</div>
        <div>
          Click "Create Game" -> Choose your game settings -> Wait for players
          to join your lobby -> Click "Start Game"
        </div>

        <div className="subtitle">Joining a game</div>
        <div>
          Click "Join Game" -> Select a lobby to join -> Wait for the host to
          start the game
        </div>

        <div className="subtitle">Gameplay</div>
        <div>
          Move your player with the left/right/up/down arrow keys. Collect coins
          and power-ups that spawn on the arena!
        </div>

        <div className="subtitle">Power-ups</div>

        {Object.keys(POWERUPS).map((powerup, index) => (
          <div className="powerupRow" key={index}>
            <div className="powerupBox">
              <FontAwesomeIcon
                icon={POWERUPS[powerup].icon}
                className="powerupIcon"
              />
            </div>
            <div className="powerupDescription">
              <b>{POWERUPS[powerup].name}</b> {POWERUPS[powerup].description}
            </div>
          </div>
        ))}

        <div className="subtitle">Weaknesses</div>

        {Object.keys(WEAKNESSES).map((weakness, index) => (
          <div className="powerupRow" key={index}>
            <div className="powerupBox">
              <FontAwesomeIcon
                icon={WEAKNESSES[weakness].icon}
                className="powerupIcon"
              />
            </div>
            <div className="powerupDescription">
              <b>{WEAKNESSES[weakness].name}</b>{" "}
              {WEAKNESSES[weakness].description}
            </div>
          </div>
        ))}
      </div>

      <div className="techStack">
        <div className="title">Tech Stack</div>

        {Object.keys(TECH_STACK).map((tool, index) => (
          <div className="toolRow" key={index}>
            <b>{TECH_STACK[tool].name}:</b> {TECH_STACK[tool].description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
