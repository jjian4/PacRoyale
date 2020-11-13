module.exports = {
  initLobby,
  addPlayerToLobby,
  gameLoop,
  updatePlayerVelocity,
};

const playerSize = 4;
const velocity = 2;

function initLobby(username) {
  return {
    host: username,
    players: {},
    started: false,
  };
}

function addPlayerToLobby(state, username, isHost) {
  state.players[username] = {
    pos: {
      x: Math.floor(Math.random() * (100 - playerSize)),
      y: Math.floor(Math.random() * (100 - playerSize)),
    },
    vel: {
      x: 0,
      y: 0,
    },
    isHost,
  };
}

function gameLoop(state) {
  for (const username of Object.keys(state.players)) {
    state.players[username].pos.x += state.players[username].vel.x;
    // Horizontal border collision
    if (state.players[username].pos.x > 100 - playerSize) {
      state.players[username].pos.x = 100 - playerSize;
      state.players[username].vel.x = 0;
    } else if (state.players[username].pos.x < 0) {
      state.players[username].pos.x = 0;
      state.players[username].vel.x = 0;
    }
    // Vertical border collision
    state.players[username].pos.y += state.players[username].vel.y;
    if (state.players[username].pos.y > 100 - playerSize) {
      state.players[username].pos.y = 100 - playerSize;
      state.players[username].vel.y = 0;
    } else if (state.players[username].pos.y < 0) {
      state.players[username].pos.y = 0;
      state.players[username].vel.y = 0;
    }
  }
}

function updatePlayerVelocity(state, username, keyCode) {
  switch (keyCode) {
    case 37: {
      // left
      state.players[username].vel.x = -velocity;
      state.players[username].vel.y = 0;
      break;
    }
    case 38: {
      // down
      state.players[username].vel.y = -velocity;
      state.players[username].vel.x = 0;
      break;
    }
    case 39: {
      // right
      state.players[username].vel.x = velocity;
      state.players[username].vel.y = 0;
      break;
    }
    case 40: {
      // up
      state.players[username].vel.y = velocity;
      state.players[username].vel.x = 0;
      break;
    }
    default:
      break;
  }
  console.log(state.players[username]);
}
