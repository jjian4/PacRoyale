const io = require("socket.io")();
const { makeId } = require("./utils");
const { MAX_PLAYERS, FRAME_RATE } = require("./constants");
const {
  initLobby,
  addPlayerToLobby,
  gameLoop,
  updatePlayerVelocity,
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

  function handleNewGame(username) {
    let roomName = makeId(5);
    clientRooms[client.id] = roomName;
    client.emit("gameCode", roomName);

    state[roomName] = initLobby(username);
    addPlayerToLobby(state[roomName], username, true);

    client.join(roomName);
    client.username = username;
    client.isHost = true;
    client.emit("lobbyCreated");
    broadcastAllRoomInfo();
  }

  function handleJoinGame(roomName, username) {
    const room = io.sockets.adapter.rooms.get(roomName);
    let numClients = 0;
    if (room) {
      numClients = room.size;
    }
    console.log(room);
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
    addPlayerToLobby(state[roomName], username, false);
    broadcastRoomInfo(roomName);
    broadcastAllRoomInfo();
    client.emit("joinedLobby");
  }

  function handleStartGame(roomName) {
    io.sockets.in(roomName).emit("init");
    startGameInterval(roomName);
  }

  function handleKeydown(keyCode) {
    console.log("handle keycode");
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }
    console.log("handle keycode2");
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
    if (client.isHost && !state[roomName].started) {
      io.sockets.in(roomName).emit("hostDisconnect");
      delete state[roomName];
    } else {
      client.emit("playerDisconnect");
      delete state[roomName].players[client.username];
      broadcastRoomInfo(roomName);
    }
    broadcastAllRoomInfo();
  }

  function broadcastAllRoomInfo() {
    const rooms = [];
    for (let [gameCode, room] of Object.entries(state)) {
      rooms.push({
        host: room.host,
        gameCode,
        numPlayers: Object.keys(room.players).length,
      });
    }
    io.sockets.emit("rooms", JSON.stringify(rooms));
  }

  function emitAllRoomInfo() {
    const rooms = [];
    for (let [gameCode, room] of Object.entries(state)) {
      rooms.push({
        host: room.host,
        gameCode,
        numPlayers: Object.keys(room.players).length,
      });
    }
    client.emit("rooms", JSON.stringify(rooms));
  }

  function broadcastRoomInfo(roomName) {
    const players = [];
    for (const [username, value] of Object.entries(state[roomName].players)) {
      players.push({ username, isHost: value.isHost });
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
      players.push({ username, isHost: value.isHost });
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

function startGameInterval(roomName) {
  state[roomName].started = true;
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);
    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(room, gameState) {
  io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  io.sockets.in(room).emit("gameOver", JSON.stringify({ winner }));
  delete state[room];
}

io.listen(3001);
