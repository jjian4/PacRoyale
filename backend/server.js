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
  client.on("getRooms", emitAllRoomInfo);
  client.on("playerDisconnect", handleDisconnect);
  client.on("disconnect", handleDisconnect);

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
    const room = io.sockets.adapter.rooms[roomName];
    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
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

    addPlayerToLobby(state[roomName], username, false);
    emitRoomInfo(roomName);
    broadcastAllRoomInfo();
  }

  function handleStartGame(roomName) {
    io.sockets.in(roomName).emit("init");
    startGameInterval(roomName);
  }

  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
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
    console.log("disconnect");
    const roomName = clientRooms[client.id];
    console.log(clientRooms);
    console.log(client.id);
    if (!roomName || !state[roomName]) {
      io.sockets.in(roomName).emit("hostDisconnect");
      return;
    }
    if (client.isHost && !state[roomName].started) {
      io.sockets.in(roomName).emit("hostDisconnect");
      delete state[roomName];
    } else {
      delete state[roomName].players[client.username];
      emitRoomInfo(roomName);
    }
    broadcastAllRoomInfo();
  }

  function broadcastAllRoomInfo() {
    const rooms = [];
    for (let [_, room] of Object.entries(state)) {
      rooms.push({
        host: room.host,
        numPlayers: Object.keys(room.players).length,
      });
    }
    console.log(rooms);
    io.sockets.emit("rooms", JSON.stringify(rooms));
  }

  function emitAllRoomInfo() {
    const rooms = [];
    for (let [_, room] of Object.entries(state)) {
      rooms.push({
        host: room.host,
        numPlayers: Object.keys(room.players).length,
      });
    }
    console.log(rooms);
    client.emit("rooms", JSON.stringify(rooms));
  }

  function emitRoomInfo(roomName) {
    io.sockets.in(roomName).emit(
      "players",
      JSON.stringify({
        gameCode: roomName,
        players: Object.keys(state[roomName].players),
      })
    );
  }
});

function startGameInterval(roomName) {
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
