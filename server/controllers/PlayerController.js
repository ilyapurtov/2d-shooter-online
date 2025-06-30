import { config } from "../config.js";

export class PlayerController {
  constructor() {
    this.backendPlayers = {};
  }

  getPlayersCount() {
    return Object.keys(this.backendPlayers).length;
  }
  // adding connected player
  addPlayer(socketId, nickname, skinNumber) {
    this.backendPlayers[socketId] = {
      x: Math.round((config.game.width - config.player.width) * Math.random()),
      y: Math.round(
        (config.game.height - config.player.height) * Math.random()
      ),
      color: `hsl(${Math.round(360 * Math.random())}, 60%, 70%)`,
      sequenceNumber: 0,
      nickname,
      skinNumber,
    };
  }

  movePlayer(socketId, sequenceNumber, direction) {
    const player = this.backendPlayers[socketId];
    if (direction == "up") {
      player.y -= config.player.speed;
    } else if (direction == "left") {
      player.x -= config.player.speed;
    } else if (direction == "down") {
      player.y += config.player.speed;
    } else if (direction == "right") {
      player.x += config.player.speed;
    }
    player.sequenceNumber = sequenceNumber;
  }

  // removing player
  removePlayer(socketId) {
    delete this.backendPlayers[socketId];
  }
}
