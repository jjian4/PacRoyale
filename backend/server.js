const io = require("socket.io")();
const { makeId } = require("./utils");
const {
  MAX_PLAYERS,
  FRAME_RATE,
  GAME_MODES,
  ELIMINATION_RATE,
} = require("./constants");
const {
  initLobby,
  addPlayerToLobby,
  gameLoop,
  updatePlayerVelocity,
  spawnFoods,
  spawnPowerups,
  spawnGhosts,
  spawnSlows,
  spawnBombs,
  eliminateLowestPlayer,
} = require("./game");

const state = {};
const clientRooms = {};

io.on("connection", (client) => {
  client.on("keydown", handleKeydown);
  client.on("newGame", handleNewGame);
  client.on("joinGame", handleJoinGame);
  client.on("startGame", handleStartGame);
  client.on("playerDisconnect", handleDisconnect);
  client.on("disconnect", handleDisconnect);
  client.on("getRooms", emitAllRoomInfo);
  client.on("getPlayers", emitRoomInfo);

  function handleNewGame(
    username,
    equippedSkin,
    arenaColor,
    selectedPowerups,
    selectedWeaknesses,
    selectedGameMode,
    selectedSpawnRate
  ) {
    let roomName = makeId(5);
    clientRooms[client.id] = roomName;
    client.emit("gameCode", roomName);

    state[roomName] = initLobby(
      username,
      arenaColor,
      selectedPowerups,
      selectedWeaknesses,
      selectedGameMode,
      selectedSpawnRate
    );
    console.log("newgame", state[roomName]);
    console.log(state);
    addPlayerToLobby(state[roomName], client.id, username, equippedSkin, true);

    client.join(roomName);
    client.username = username;
    client.isHost = true;
    client.emit("lobbyCreated");
    broadcastAllRoomInfo();
  }

  function handleJoinGame(roomName, username, equippedSkin) {
    const room = io.sockets.adapter.rooms.get(roomName);
    let numClients = 0;
    if (room) {
      numClients = room.size;
    }
    if (numClients === 0) {
      client.emit("unknownCode");
      return;
    } else if (numClients > MAX_PLAYERS) {
      client.emit("tooManyPlayers");
      return;
    }
    clientRooms[client.id] = roomName;
    client.join(roomName);
    client.username = username;
    client.isHost = false;
    addPlayerToLobby(state[roomName], client.id, username, equippedSkin, false);
    broadcastRoomInfo(roomName);
    broadcastAllRoomInfo();
    client.emit("joinedLobby");
  }

  function handleStartGame(roomName) {
    io.sockets.in(roomName).emit("init");
    startGameInterval(roomName, client);
    broadcastAllRoomInfo();
  }

  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id];
    if (!roomName || !state[roomName]) {
      return;
    }
    try {
      keyCode = parseInt(keyCode);
    } catch (e) {
      console.log(e);
      return;
    }
    updatePlayerVelocity(state[roomName], client.username, keyCode);
  }

  function handleDisconnect() {
    const roomName = clientRooms[client.id];
    if (!roomName || !state[roomName]) {
      io.sockets.in(roomName).emit("hostDisconnect");
      return;
    }
    if (!state[roomName].started) {
      if (client.isHost) {
        io.sockets.in(roomName).emit("lobbyDisconnect");
        delete state[roomName];
      } else {
        delete state[roomName].players[client.username];
        client.emit("lobbyDisconnect");
        broadcastRoomInfo(roomName);
      }
      broadcastAllRoomInfo();
    } else {
      delete state[roomName].players[client.username];
      console.log(Object.keys(state[roomName].players));
      if (Object.keys(state[roomName].players).length === 0) {
        state[roomName].clearIntervals();
        delete state[roomName];
      }
    }
  }

  function broadcastAllRoomInfo() {
    const rooms = [];
    for (let [gameCode, room] of Object.entries(state)) {
      if (room && !room.started) {
        rooms.push({
          host: room.host,
          equippedSkin: room.players[room.host].equippedSkin,
          gameCode,
          numPlayers: Object.keys(room.players).length,
        });
      }
    }
    io.sockets.emit("rooms", JSON.stringify(rooms));
  }

  function emitAllRoomInfo() {
    const rooms = [];
    for (let [gameCode, room] of Object.entries(state)) {
      if (room) {
        console.log(gameCode, room);
        rooms.push({
          host: room.host,
          equippedSkin: room.players[room.host].equippedSkin,
          gameCode,
          numPlayers: Object.keys(room.players).length,
        });
      }
    }
    client.emit("rooms", JSON.stringify(rooms));
  }

  function broadcastRoomInfo(roomName) {
    const players = [];
    for (const [username, value] of Object.entries(state[roomName].players)) {
      players.push({
        username,
        isHost: value.isHost,
        equippedSkin: value.equippedSkin,
      });
    }
    io.sockets.in(roomName).emit(
      "players",
      JSON.stringify({
        gameCode: roomName,
        players,
        host: state[roomName].host,
      })
    );
  }

  function emitRoomInfo() {
    const roomName = clientRooms[client.id];
    if (!roomName || !state[roomName]) {
      client.emit("hostDisconnect");
      return;
    }
    const players = [];
    for (const [username, value] of Object.entries(state[roomName].players)) {
      players.push({
        username,
        isHost: value.isHost,
        equippedSkin: value.equippedSkin,
      });
    }
    client.emit(
      "players",
      JSON.stringify({
        gameCode: roomName,
        players,
        host: state[roomName].host,
      })
    );
  }
});

function startGameInterval(roomName, client) {
  state[roomName].started = true;
  const spawnRate =
    state[roomName].selectedSpawnRate === "low"
      ? 1500
      : state[roomName].selectedSpawnRate === "medium"
      ? 1000
      : 500;
  const spawnFoodIntervalId = setInterval(() => {
    spawnFoods(state[roomName]);
  }, spawnRate);
  let spawnPowerupsIntervalId = null;
  let spawnGhostsIntervalId = null;
  let spawnSlowsIntervalId = null;
  let spawnBombsIntervalId = null;
  let eliminateLowestPlayerIntervalId = null;
  if (state[roomName].selectedPowerups.length !== 0) {
    spawnPowerupsIntervalId = setInterval(() => {
      spawnPowerups(state[roomName]);
    }, spawnRate * 2);
  }
  if (state[roomName].isGhostSelected) {
    spawnGhostsIntervalId = setInterval(() => {
      spawnGhosts(state[roomName]);
    }, spawnRate * 1.5);
  }
  if (state[roomName].isSlowSelected) {
    const time = Math.floor(Math.random() * 3 + 1);
    spawnSlowsIntervalId = setInterval(() => {
      spawnSlows(state[roomName]);
    }, time * spawnRate * 1.5);
  }
  if (state[roomName].isBombSelected) {
    spawnBombsIntervalId = setInterval(() => {
      spawnBombs(state[roomName]);
    }, spawnRate * 1.5);
  }

  if (state[roomName].selectedGameMode === GAME_MODES.ELIMINATION) {
    eliminateLowestPlayerIntervalId = setInterval(() => {
      const eliminatedPlayer = eliminateLowestPlayer(state[roomName]);
      if (state[roomName].players[eliminatedPlayer]) {
        emitElimination(
          state[roomName].players[eliminatedPlayer].id,
          "You failed to collect enough coins and were eliminated from the arena"
        );
      }
    }, ELIMINATION_RATE);
  }

  const movementIntervalId = setInterval(() => {
    const winner = gameLoop(state[roomName], client);
    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      let message;
      switch (state[roomName].selectedGameMode) {
        case GAME_MODES.FIRST_TO_100:
          message = `${winner} collected 100 coins and is the winner!`;
          break;
        case GAME_MODES.ELIMINATION:
          message = `${winner} is the last one standing and wins!`;
          break;
        case GAME_MODES.SURVIVAL:
          message = `${winner} is the last one standing and wins!`;
          break;
        default:
          message = `Game over: ${winner} wins!`;
      }
      emitGameOver(roomName, message);
      state[roomName] = null;
      clearInterval(movementIntervalId);
      clearInterval(spawnFoodIntervalId);
      clearInterval(spawnPowerupsIntervalId);
      clearInterval(spawnGhostsIntervalId);
      clearInterval(spawnSlowsIntervalId);
      clearInterval(spawnBombsIntervalId);
      clearInterval(eliminateLowestPlayerIntervalId);
    }
  }, 1000 / FRAME_RATE);
  state[roomName].clearIntervals = () => {
    clearInterval(movementIntervalId);
    clearInterval(spawnFoodIntervalId);
    clearInterval(spawnPowerupsIntervalId);
    clearInterval(spawnGhostsIntervalId);
    clearInterval(spawnSlowsIntervalId);
    clearInterval(spawnBombsIntervalId);
    clearInterval(eliminateLowestPlayerIntervalId);
  };
}

function emitGameState(room, gameState) {
  io.sockets.in(room).emit(
    "gameState",
    JSON.stringify({
      ...gameState,
      // No need to give frontend object ids
      foods: Object.values(gameState.foods),
      powerups: Object.values(gameState.powerups),
      shots: Object.values(gameState.shots),
      ghosts: Object.values(gameState.ghosts),
      bombs: Object.values(gameState.bombs),
      explosions: Object.values(gameState.explosions),
      slows: Object.values(gameState.slows),
    })
  );
}

function emitGameOver(room, message) {
  io.sockets.in(room).emit("gameOver", message);
  delete state[room];
}

function emitElimination(playerId, message) {}

io.listen(3001);
