module.exports = {
  initLobby,
  addPlayerToLobby,
  gameLoop,
  updatePlayerVelocity,
  spawnFoods,
  spawnPowerups: spawnPowerups,
};

const POWERUPS = ["EAT", "QUIZ", "SPEED", "RPS", "GHOST"];
const WIN_AMOUNT = 100;

const playerSize = 4;
const powerupSize = 3;
const foodSize = 2;

function initLobby(username) {
  return {
    host: username,
    players: {},
    playerCount: 0,
    foods: [],
    powerups: [],
    started: false,
  };
}

function addPlayerToLobby(state, username, isHost) {
  state.playerCount++;
  state.players[username] = {
    pos: {
      x: Math.floor(Math.random() * (100 - playerSize)),
      y: Math.floor(Math.random() * (100 - playerSize)),
    },
    vel: {
      x: 0,
      y: 0,
    },
    velocity: 1,
    score: 0,
    isHost,
    powerup: "",
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

function gameLoop(state, client) {
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
        if (player.score >= WIN_AMOUNT) {
          winner = true;
        }
      }
    });
    if (winner) {
      return username;
    }
    if (player.powerup == "") {
      state.powerups.forEach((powerup, idx, arr) => {
        if (
          isColliding(
            playerX,
            playerY,
            playerSize,
            powerup.x,
            powerup.y,
            powerupSize
          )
        ) {
          client.emit("playPowerupSound");
          arr.splice(idx, 1);
          player.powerup = powerup.type;
          updateForSpeed(player, 2);
          setTimeout(() => {
            player.powerup = "";
            player.velocity = 1;
            updateForSpeed(player, 1);
          }, 3000);
        }
      });
    }
  }
  return null;
}

function updateForSpeed(player, newVelocity) {
  player.velocity = newVelocity;
  if (player.vel.x < 0) {
    player.vel.x = -newVelocity;
  } else if (player.vel.x > 0) {
    player.vel.x = newVelocity;
  }
  if (player.vel.y < 0) {
    player.vel.y = -newVelocity;
  } else if (player.vel.y > 0) {
    player.vel.y = newVelocity;
  }
}

function updatePlayerVelocity(state, username, keyCode) {
  switch (keyCode) {
    case 37: {
      // left
      state.players[username].vel.x = -state.players[username].velocity;
      state.players[username].vel.y = 0;
      break;
    }
    case 38: {
      // down
      state.players[username].vel.y = -state.players[username].velocity;
      state.players[username].vel.x = 0;
      break;
    }
    case 39: {
      // right
      state.players[username].vel.x = state.players[username].velocity;
      state.players[username].vel.y = 0;
      break;
    }
    case 40: {
      // up
      state.players[username].vel.y = state.players[username].velocity;
      state.players[username].vel.x = 0;
      break;
    }
    default:
      break;
  }
}

function spawnFoods(state) {
  state.foods.push({
    x: Math.floor(Math.random() * (100 - foodSize)),
    y: Math.floor(Math.random() * (100 - foodSize)),
  });
}

function spawnPowerups(state) {
  state.powerups.push({
    x: Math.floor(Math.random() * (100 - foodSize)),
    y: Math.floor(Math.random() * (100 - foodSize)),
    type: "SPEED",
  });
}
