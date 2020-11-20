const { v4: uuid } = require("uuid");

const WIN_AMOUNT = 100;

const PLAYER_SIZE = 4;
const POWERUP_SIZE = 3;
const FOOD_SIZE = 2;
const BULLET_SIZE = 1;

const SPEED_TIMEOUT = 3000;
const EAT_TIMEOUT = 5000;
const SHOOT_TIMEOUT = 5000;
const STUN_TIMEOUT = 5000;
const SLOW_TIMEOUT = 5000;

const BULLET_VELOCITY = 2.5;

function initLobby(username, arenaColor, selectedPowerups) {
  return {
    host: username,
    players: {},
    playerCount: 0,
    foods: {},
    powerups: {},
    shots: {},
    started: false,
    arenaColor,
    selectedPowerups,
    isStunned: false,
  };
}

function addPlayerToLobby(state, username, isHost) {
  state.playerCount++;
  state.players[username] = {
    pos: {
      x: Math.floor(Math.random() * (100 - PLAYER_SIZE)),
      y: Math.floor(Math.random() * (100 - PLAYER_SIZE)),
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
    if (!player.isStunned) {
      player.pos.x += player.vel.x;
      // Horizontal border collision
      if (player.pos.x > 100 - PLAYER_SIZE) {
        player.pos.x = 100 - PLAYER_SIZE;
        player.vel.x = 0;
      } else if (player.pos.x < 0) {
        player.pos.x = 0;
        player.vel.x = 0;
      }
      // Vertical border collision
      player.pos.y += player.vel.y;
      if (player.pos.y > 100 - PLAYER_SIZE) {
        player.pos.y = 100 - PLAYER_SIZE;
        player.vel.y = 0;
      } else if (player.pos.y < 0) {
        player.pos.y = 0;
        player.vel.y = 0;
      }
    }

    for (let [key, shot] of Object.entries(state.shots)) {
      shot.pos.x += shot.vel.x;
      shot.pos.y += shot.vel.y;
      if (
        shot.pos.x < 0 ||
        shot.pos.x > 100 ||
        shot.pos.y < 0 ||
        shot.pos.y > 100
      ) {
        delete state.shots[key];
      }
    }

    const playerY = player.pos.y;
    const playerX = player.pos.x;
    let winner = false;

    for (let [key, food] of Object.entries(state.foods)) {
      if (
        isColliding(playerX, playerY, PLAYER_SIZE, food.x, food.y, FOOD_SIZE)
      ) {
        delete state.foods[key];
        player.score += 1;
        if (player.score >= WIN_AMOUNT) {
          winner = true;
        }
      }
    }
    if (winner) {
      return username;
    }
    if (player.powerup === "") {
      for (const [key, powerup] of Object.entries(state.powerups)) {
        if (
          isColliding(
            playerX,
            playerY,
            PLAYER_SIZE,
            powerup.x,
            powerup.y,
            POWERUP_SIZE
          )
        ) {
          client.emit("playPowerupSound");
          delete state.powerups[key];
          player.powerup = powerup.name;
          if (powerup.name === "Speed") {
            updateForSpeed(player, 2);
            setTimeout(() => {
              player.powerup = "";
              updateForSpeed(player, 1);
            }, SPEED_TIMEOUT);
          } else if (powerup.name === "Eat") {
            setTimeout(() => {
              player.powerup = "";
            }, EAT_TIMEOUT);
          } else if (powerup.name === "Shoot") {
            const shotTimeout = setTimeout(() => {
              player.powerup = "";
            }, SHOOT_TIMEOUT);
            player.clearShot = () => {
              clearTimeout(shotTimeout);
            };
          }
        }
      }
    } else if (player.powerup === "Eat") {
      for (const otherUsername of Object.keys(state.players)) {
        if (
          username != otherUsername &&
          !state.players[otherUsername].isStunned &&
          state.players[otherUsername].powerup !== "Eat" &&
          isColliding(
            playerX,
            playerY,
            PLAYER_SIZE,
            state.players[otherUsername].pos.x,
            state.players[otherUsername].pos.y,
            PLAYER_SIZE
          )
        ) {
          state.players[otherUsername].isStunned = true;
          setTimeout(() => {
            state.players[otherUsername].isStunned = false;
          }, STUN_TIMEOUT);
        }
      }
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
    case 32: {
      if (state.players[username].powerup === "Shoot") {
        state.players[username].powerup = "";
        state.players[username].clearShot();

        state.shots[uuid()] = {
          pos: {
            x:
              state.players[username].pos.x + PLAYER_SIZE / 2 - BULLET_SIZE / 2,
            y:
              state.players[username].pos.y + PLAYER_SIZE / 2 - BULLET_SIZE / 2,
          },
          vel: {
            x: state.players[username].vel.x * BULLET_VELOCITY,
            y: state.players[username].vel.y * BULLET_VELOCITY,
          },
          owner: username,
        };
      }
      break;
    }
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
  state.foods[uuid()] = {
    x: Math.floor(Math.random() * (100 - FOOD_SIZE)),
    y: Math.floor(Math.random() * (100 - FOOD_SIZE)),
  };
}

function spawnPowerups(state) {
  var name =
    state.selectedPowerups[
      Math.floor(Math.random() * state.selectedPowerups.length)
    ];

  state.powerups[uuid()] = {
    x: Math.floor(Math.random() * (100 - FOOD_SIZE)),
    y: Math.floor(Math.random() * (100 - FOOD_SIZE)),
    name,
  };
}

module.exports = {
  initLobby,
  addPlayerToLobby,
  gameLoop,
  updatePlayerVelocity,
  spawnFoods,
  spawnPowerups,
};
