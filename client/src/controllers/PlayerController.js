import { Player } from "../engine/Player";
import { gsap } from "gsap";

export class PlayerController {
  constructor({ socket, config }) {
    this.socket = socket;
    this.config = config;

    // list of players
    this.frontendPlayers = {};

    // current player moving state
    this.moving = {
      up: false,
      left: false,
      down: false,
      right: false,
    };

    // for server reconciliation
    this.sequenceNumber = 0;
    this.playerInputs = [];
  }

  // emits from the server
  updatePlayers(backendPlayers) {
    // updating frontend players based on backend players
    for (const id in backendPlayers) {
      const backendPlayer = backendPlayers[id];

      // adding new frontend player if not exists
      if (!this.frontendPlayers[id]) {
        // loading skin
        const skin = new Image();
        skin.src =
          this.config.player.skinsURL +
          `/player${backendPlayer.skinNumber}.jpg`;

        // creating new player object
        this.frontendPlayers[id] = new Player({
          x: backendPlayer.x,
          y: backendPlayer.y,
          width: this.config.player.width,
          height: this.config.player.height,
          color: backendPlayer.color,
          nickname: backendPlayer.nickname,
          skin,
        });
      } else {
        if (id == this.socket.id) {
          // for current player we do server reconciliation to reduce lagging
          this.frontendPlayers[id].x = backendPlayer.x;
          this.frontendPlayers[id].y = backendPlayer.y;

          // number of last event emitted on server
          const serverSequenceNumber = backendPlayer.sequenceNumber;
          const index = this.playerInputs.findIndex(
            (input) => input.sequenceNumber == serverSequenceNumber
          );
          if (index > -1) {
            this.playerInputs.splice(0, index + 1);
          }
          // reconciliating remained events that were lagged
          this.playerInputs.forEach((input) => {
            this.frontendPlayers[id].x += input.dx;
            this.frontendPlayers[id].y += input.dy;
          });
        } else {
          // for other players we do interpolation to make their movement smoother
          gsap.to(this.frontendPlayers[id], {
            x: backendPlayer.x,
            y: backendPlayer.y,
            duration: 1 / this.config.game.fps,
            ease: "linear",
          });
        }
      }
    }

    // checking and deleting disconnected players
    for (const id in this.frontendPlayers) {
      if (!backendPlayers[id]) {
        delete this.frontendPlayers[id];
      }
    }
  }

  // predicting current player movement and sending data on the server
  update() {
    const player = this.frontendPlayers[this.socket.id];
    if (!player) return;
    const speed = this.config.player.speed;
    if (this.moving.up) {
      this.sequenceNumber++;
      player.y -= speed;
      this.socket.emit("movePlayer", this.sequenceNumber, "up");
      this.playerInputs.push({
        sequenceNumber: this.sequenceNumber,
        dx: 0,
        dy: -speed,
      });
    }
    if (this.moving.left) {
      this.sequenceNumber++;
      player.x -= speed;
      this.socket.emit("movePlayer", this.sequenceNumber, "left");
      this.playerInputs.push({
        sequenceNumber: this.sequenceNumber,
        dx: -speed,
        dy: 0,
      });
    }
    if (this.moving.down) {
      this.sequenceNumber++;
      player.y += speed;
      this.socket.emit("movePlayer", this.sequenceNumber, "down");
      this.playerInputs.push({
        sequenceNumber: this.sequenceNumber,
        dx: 0,
        dy: speed,
      });
    }
    if (this.moving.right) {
      this.sequenceNumber++;
      player.x += speed;
      this.socket.emit("movePlayer", this.sequenceNumber, "right");
      this.playerInputs.push({
        sequenceNumber: this.sequenceNumber,
        dx: speed,
        dy: 0,
      });
    }
  }

  // render all players
  render(ctx) {
    for (const id in this.frontendPlayers) {
      const player = this.frontendPlayers[id];
      player.render(ctx);
    }
  }
}
