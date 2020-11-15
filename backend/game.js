module.exports = {
  initLobby,
  addPlayerToLobby,
  gameLoop,
  updatePlayerVelocity,
  spawnFoods,
  spawnPowerUps,
};

const playerSize = 4;
const velocity = 1;
const powerUpSize = 3;
const foodSize = 2;

function initLobby(username) {
  return {
    host: username,
    players: {},
    foods: [],
    powerUps: [],
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
    score: 0,
    isHost,
  };
}

function isCollidingOneDimension(item1x, item1Size, item2x, item2Size) {
  // If one partially overlaps with other
  if (
    item1x <= item2x &&
    item1x + item1Size >= item2x &&
    item1x + item1Size <= item2x + item2Size
  ) {
    return true;
  }
  if (
    item2x <= item1x &&
    item2x + item2Size >= item1x &&
    item2x + item2Size <= item1x + item1Size
  ) {
    return true;
  }

  // If one completely overlaps with other
  if (item1x <= item2x && item1x + item1Size >= item2x + item2Size) {
    return true;
  }
  if (item2x <= item1x && item2x + item2Size >= item1x + item1Size) {
    return true;
  }

  return false;
}

function isColliding(item1x, item1y, item1Size, item2x, item2y, item2Size) {
  return (
    isCollidingOneDimension(item1x, item1Size, item2x, item2Size) &&
    isCollidingOneDimension(item1y, item1Size, item2y, item2Size)
  );
}

function gameLoop(state) {
  for (const username of Object.keys(state.players)) {
    const player = state.players[username];
    player.pos.x += player.vel.x;
    // Horizontal border collision
    if (player.pos.x > 100 - playerSize) {
      player.pos.x = 100 - playerSize;
      player.vel.x = 0;
    } else if (player.pos.x < 0) {
      player.pos.x = 0;
      player.vel.x = 0;
    }
    // Vertical border collision
    player.pos.y += player.vel.y;
    if (player.pos.y > 100 - playerSize) {
      player.pos.y = 100 - playerSize;
      player.vel.y = 0;
    } else if (player.pos.y < 0) {
      player.pos.y = 0;
      player.vel.y = 0;
    }
    const playerY = player.pos.y;
    const playerX = player.pos.x;
    let winner = false;
    state.foods.forEach((food, idx, arr) => {
      if (isColliding(playerX, playerY, playerSize, food.x, food.y, foodSize)) {
        arr.splice(idx, 1);
        player.score += 1;
        if (player.score >= 10) {
          winner = true;
        }
      }
    });
    if (winner) {
      console.log(username);
      return username;
    }
    state.powerUps.forEach((powerUp, idx, arr) => {
      if (
        isColliding(
          playerX,
          playerY,
          playerSize,
          powerUp.x,
          powerUp.y,
          powerUpSize
        )
      ) {
        arr.splice(idx, 1);
      }
    });
  }
  return null;
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

function spawnFoods(state) {
  state.foods.push({
    x: Math.floor(Math.random() * (100 - foodSize)),
    y: Math.floor(Math.random() * (100 - foodSize)),
  });
}

function spawnPowerUps(state) {
  state.powerUps.push({
    x: Math.floor(Math.random() * (100 - foodSize)),
    y: Math.floor(Math.random() * (100 - foodSize)),
    type: Math.floor(Math.random() * 4),
  });
}
