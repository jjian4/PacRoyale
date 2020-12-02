const { v4: uuid } = require("uuid");
const { GAME_MODES } = require("./constants");

const FIRST_TO_100_WIN_AMOUNT = 100;

const PLAYER_SIZE = 4;
const POWERUP_SIZE = 3;
const FOOD_SIZE = 2;
const SHOT_SIZE = 1;
const GHOST_SIZE = 4;
const BOMB_SIZE = 3;

const SPEED_TIMEOUT = 3000;
const EAT_TIMEOUT = 5000;
const SHOOT_TIMEOUT = 5000;
const STUN_TIMEOUT = 3000;

const SHOT_VELOCITY = 3.5;
const GHOST_VELOCITY = 1.5;

function initLobby(
  username,
  arenaColor,
  selectedPowerups,
  selectedWeaknesses,
  selectedGameMode
) {
  const isSlowSelected = selectedWeaknesses.find((x) => x === "Slow") != null;
  const isGhostSelected = selectedWeaknesses.find((x) => x === "Ghost") != null;
  const isBombSelected = selectedWeaknesses.find((x) => x === "Bomb") != null;

  return {
    host: username,
    players: {},
    foods: {},
    powerups: {},
    shots: {},
    ghosts: {},
    bombs: {},
    explosions: {},
    slows: {},
    isSlowSelected,
    isGhostSelected,
    isBombSelected,
    started: false,
    arenaColor,
    selectedPowerups,
    selectedGameMode,
    isStunned: false,
  };
}

function addPlayerToLobby(state, id, username, equippedSkin, isHost) {
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
    score: state.selectedGameMode === GAME_MODES.SURVIVAL ? 20 : 0,
    isHost,
    powerup: "",
    equippedSkin,
    id,
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

// Returns null if no winner, returns username if there's a winner
function gameLoop(state, client) {
  for (const username of Object.keys(state.players)) {
    const player = state.players[username];

    // CHECK FOR WINNER (Game modes: Elimination & Survival)
    // Note: Checking inside the loop to avoid the unlikely possibility of having no/multiple winners
    if (state.selectedGameMode === GAME_MODES.ELIMINATION || state.selectedGameMode === GAME_MODES.SURVIVAL) {
      console.log(state.players.length)
      if (Object.keys(state.players).length === 1) {
        return username;
      }
    }

    // CHECK FOR WINNER (Game mode: First to 100)
    // Note: Not checking in inner food collision loop to ensure the UI updates before winner is declaring
    if (state.selectedGameMode === GAME_MODES.FIRST_TO_100 && player.score >= FIRST_TO_100_WIN_AMOUNT) {
      return username;
    }

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

    const playerY = player.pos.y;
    const playerX = player.pos.x;

    for (let [key, food] of Object.entries(state.foods)) {
      if (
        isColliding(playerX, playerY, PLAYER_SIZE, food.x, food.y, FOOD_SIZE)
      ) {
        delete state.foods[key];
        // player.score += 1;
        player.score += 1;
      }
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
            setTimeout(() => {
              if (player) {
                player.powerup = "";
              }
            }, SPEED_TIMEOUT);
          } else if (powerup.name === "Eat") {
            setTimeout(() => {
              if (player) {
                player.powerup = "";
              }
            }, EAT_TIMEOUT);
          } else if (powerup.name === "Shoot") {
            const shotTimeout = setTimeout(() => {
              if (player) {
                player.powerup = "";
              }
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
            if (state.players[otherUsername]) {
              state.players[otherUsername].isStunned = false;
            }
          }, STUN_TIMEOUT);
        }
      }
    }

    for (let [key, shot] of Object.entries(state.shots)) {
      if (
        shot.owner != username &&
        !state.players[username].isStunned &&
        isColliding(
          playerX,
          playerY,
          PLAYER_SIZE,
          shot.pos.x,
          shot.pos.y,
          SHOT_SIZE
        )
      ) {
        delete state.shots[key];
        state.players[username].isStunned = true;
        setTimeout(() => {
          if (state.players[username]) {
            state.players[username].isStunned = false;
          }
        }, STUN_TIMEOUT);
      }
    }

    for (let [key, ghost] of Object.entries(state.ghosts)) {
      if (
        !state.players[username].isStunned &&
        isColliding(
          playerX,
          playerY,
          PLAYER_SIZE,
          ghost.pos.x,
          ghost.pos.y,
          GHOST_SIZE
        )
      ) {
        state.players[username].isStunned = true;
        setTimeout(() => {
          if (state.players[username]) {
            state.players[username].isStunned = false;
          }
        }, STUN_TIMEOUT);
      }
    }
    for (let [key, explosion] of Object.entries(state.explosions)) {
      if (
        !state.players[username].isStunned &&
        isColliding(
          playerX,
          playerY,
          PLAYER_SIZE,
          explosion.pos.x,
          explosion.pos.y,
          explosion.size
        )
      ) {
        state.players[username].isStunned = true;
        setTimeout(() => {
          if (state.players[username]) {
            state.players[username].isStunned = false;
          }
        }, STUN_TIMEOUT);
      }
    }
    let isSlowed = false;
    const isFast = state.players[username].powerup === "Speed";
    for (let [key, slow] of Object.entries(state.slows)) {
      if (
        isColliding(
          playerX,
          playerY,
          PLAYER_SIZE,
          slow.pos.x,
          slow.pos.y,
          slow.size
        )
      ) {
        isSlowed = true;
        break;
      }
    }
    if (isSlowed) {
      if (isFast) {
        updateForSpeed(state.players[username], 1);
      } else {
        updateForSpeed(state.players[username], 0.5);
      }
    } else {
      if (isFast) {
        updateForSpeed(state.players[username], 2);
      } else {
        updateForSpeed(state.players[username], 1);
      }
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

  if (state.isGhostSelected) {
    for (let [key, ghost] of Object.entries(state.ghosts)) {
      ghost.pos.x += ghost.vel.x;
      ghost.pos.y += ghost.vel.y;
      if (
        ghost.pos.x < -GHOST_SIZE ||
        ghost.pos.x > 100 + GHOST_SIZE ||
        ghost.pos.y < -GHOST_SIZE ||
        ghost.pos.y > 100 + GHOST_SIZE
      ) {
        delete state.ghosts[key];
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

function spawnGhosts(state) {
  const spawnFromTopOrBot = Math.random() > 0.5;
  let posX, posY, velX, velY;

  if (spawnFromTopOrBot) {
    const spawnFromTop = Math.random() > 0.5;
    if (spawnFromTop) {
      posX = Math.random() * 100;
      posY = -GHOST_SIZE;
      velX = 0;
      velY = GHOST_VELOCITY;
    } else {
      posX = Math.random() * 100;
      posY = 100;
      velX = 0;
      velY = -GHOST_VELOCITY;
    }
  } else {
    const spawnFromLeft = Math.random() > 0.5;
    if (spawnFromLeft) {
      posX = -GHOST_SIZE;
      posY = Math.random() * 100;
      velX = GHOST_VELOCITY;
      velY = 0;
    } else {
      posX = 100;
      posY = Math.random() * 100;
      velX = -GHOST_VELOCITY;
      velY = 0;
    }
  }
  state.ghosts[uuid()] = {
    pos: {
      x: posX,
      y: posY,
    },
    vel: {
      x: velX,
      y: velY,
    },
  };
}

function updatePlayerVelocity(state, username, keyCode) {
  switch (keyCode) {
    case 32: {
      if (state.players[username].powerup === "Shoot") {
        state.players[username].powerup = "";
        state.players[username].clearShot();

        state.shots[uuid()] = {
          pos: {
            x: state.players[username].pos.x + PLAYER_SIZE / 2 - SHOT_SIZE / 2,
            y: state.players[username].pos.y + PLAYER_SIZE / 2 - SHOT_SIZE / 2,
          },
          vel: {
            x:
              state.players[username].vel.x < 0
                ? -SHOT_VELOCITY
                : state.players[username].vel.x > 0
                  ? SHOT_VELOCITY
                  : 0,
            y:
              state.players[username].vel.y < 0
                ? -SHOT_VELOCITY
                : state.players[username].vel.y > 0
                  ? SHOT_VELOCITY
                  : 0,
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
  if (state.foods) {
    state.foods[uuid()] = {
      x: Math.floor(Math.random() * (100 - FOOD_SIZE)),
      y: Math.floor(Math.random() * (100 - FOOD_SIZE)),
    };
  }
}

function spawnPowerups(state) {
  if (state.powerups) {
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
}

function spawnSlows(state) {
  if (state.slows) {
    const size = Math.floor(Math.random() * 5 + 10);
    const slowId = uuid();
    state.slows[slowId] = {
      pos: {
        x: Math.floor(Math.random() * (100 - size)),
        y: Math.floor(Math.random() * (100 - size)),
      },
      size,
    };
    const time = Math.floor(Math.random() * 10 + 10);
    setTimeout(() => {
      if (state.slows[slowId]) {
        delete state.slows[slowId];
      }
    }, time * 1000);
  }
}

function spawnBombs(state) {
  if (state.bombs) {
    const bombId = uuid();
    state.bombs[bombId] = {
      pos: {
        x: Math.floor(Math.random() * (100 - BOMB_SIZE)),
        y: Math.floor(Math.random() * (100 - BOMB_SIZE)),
      },
      percentage: 0,
    };
    const bombPercentInterval = setInterval(() => {
      if (state.bombs[bombId]) {
        state.bombs[bombId].percentage += 1;
        if (state.bombs[bombId].percentage > 100) {
          spawnExplosion(
            state,
            state.bombs[bombId].pos.x,
            state.bombs[bombId].pos.y
          );
          clearInterval(bombPercentInterval);
          delete state.bombs[bombId];
        }
      }
    }, 30);
  }
}

function spawnExplosion(state, bombX, bombY) {
  if (state.explosions) {
    const explosionId = uuid();
    const explosionSize = Math.floor(Math.random() * 10 + 10);
    state.explosions[explosionId] = {
      pos: {
        x: bombX + BOMB_SIZE / 2 - explosionSize / 2,
        y: bombY + BOMB_SIZE / 2 - explosionSize / 2,
      },
      size: explosionSize,
    };
    setTimeout(() => {
      if (state.explosions[explosionId]) {
        delete state.explosions[explosionId];
      }
    }, 2000);
  }
}

// Game mode: Elimination
function eliminateLowestPlayer(state) {
  let minScore = Number.MAX_SAFE_INTEGER;
  let minPlayers = []

  for (const username of Object.keys(state.players)) {
    const player = state.players[username];
    if (player.score < minScore) {
      minScore = player.score;
      minPlayers = [username];
    } else if (player.score === minScore) {
      minPlayers.push(username);
    }
  }

  // Randomly eliminate a player with the lowest current score
  return minPlayers[Math.floor(Math.random() * minPlayers.length)];
}

// Game mode: Survival
function getNoCoinPlayers(state) {
  let playersToRemove = []
  for (const username of Object.keys(state.players)) {
    const player = state.players[username];
    if (player.score === 0) {
      playersToRemove.push(username);
    }
  }
  return playersToRemove;
}


module.exports = {
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
  getNoCoinPlayers
};
