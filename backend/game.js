module.exports = {
  initGame,
  addPlayerToGame,
  gameLoop,
  updatePlayerVelocity,
};

function initGame() {
  return {
    players: {},
  };
}

function addPlayerToGame(state, username) {
  state.players[username] = {
    pos: {
      x: 0,
      y: 0,
    },
    vel: {
      x: 5,
      y: 0,
    },
  };
}

function gameLoop(state) {
  for (username in Object.keys(state.players)) {
    state.players[username].pos.x += state.players[username].vel.x;
    state.players[username].pos.y += state.players[username].vel.y;
  }
}

function updatePlayerVelocity(state, username, keyCode) {
  switch (keyCode) {
    case 37: {
      // left
      state.players[username].vel.x = -5;
    }
    case 38: {
      // down
      state.players[username].vel.y = 5;
    }
    case 39: {
      // right
      state.players[username].vel.x = 5;
    }
    case 40: {
      // up
      state.players[username].vel.y = -5;
    }
  }
}
