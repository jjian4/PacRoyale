import React from "react";
import { useState, useEffect, useContext } from "react";
import AppContext from "./../../contexts/AppContext";
import { AVATARS } from "../../utils/constants";
import "./JoinGame.scss";

function JoinGame() {
  const { socket, username } = useContext(AppContext);
  const [gameCode, setGameCode] = useState("");
  const [activeGames, setActiveGames] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  useEffect(() => {
    socket.emit("getRooms");
    socket.on("rooms", (data) => {
      console.log(data);
      setActiveGames(JSON.parse(data));
    });
    socket.on("unknownCode", () => {
      alert("Unknown game code");
    });
    socket.on("tooManyPlayers", () => {
      alert("Too many players");
    });
  }, []);
  const handleJoinGame = () => {
    setGameCode("");
    socket.emit("joinGame", username);
  };


  // const updateFilter = event => {

  //   setFilterInput(event);
  // }

  const onClickJoinGame = () => {
    // TODO
  }

  return (
    <div className="JoinGame">
      <input onChange={setGameCode} placeholder="Enter a game code" />
      <button onClick={handleJoinGame}>Join Game</button>

      <hr />
      <hr />
      <hr />
      <hr />
      <hr />

      <div className='topRow'>
        <div className='activeGamesHeading'>Active Games:</div>
        <input
          className='filterInput'
          onChange={e => setFilterInput(e.target.value)}
          placeholder="Filter by username or game code"
        />
      </div>

      {activeGames
        .filter(game => game.host.toLowerCase().includes(filterInput.toLowerCase()))
        .map((game, idx) => (
          <div className='gameRow' key={game.host + idx} onClick={onClickJoinGame}>
            {/* TODO: include game code */}
            <span className='gameRowLeft'>
              {/* TODO: get avatar name from database */}
              <div className='avatar' style={AVATARS.Blue.style} />
              <div><b>{game.host}'s Arena</b> (12345)</div>
            </span>
            <span>?/20 players</span>
          </div>
        ))}
    </div>
  );
}

export default JoinGame;
