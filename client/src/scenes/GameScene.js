import { ChatController } from "../controllers/ChatController";
import { PlayerController } from "../controllers/PlayerController";
import { ProjectileController } from "../controllers/ProjectileController";
import { Scene } from "../engine/Scene";
import "../styles/game-scene.css";

export class GameScene extends Scene {
  constructor({ ctx, width, height, background, socket, config }) {
    super({
      ctx,
      width,
      height,
      fps: config.game.fps,
      UIContainer: document.getElementById("game-scene-ui"),
    });

    this.background = background;
    this.socket = socket;
    this.config = config;

    // setting up game data
    this.playerController = new PlayerController({
      socket,
      config,
    });
    this.projectileController = new ProjectileController({
      config,
    });

    // setting up event listeners
    this.listenToServerEvents();
    this.listenToClientEvents();
  }

  listenToServerEvents() {
    // count players event (initializing chat when server spawns current player)
    this.socket.on("countPlayers", (_) => {
      if (!this.chatController) {
        this.chatController = new ChatController(
          this.UIContainer,
          this.socket,
          this.playerController.frontendPlayers[this.socket.id].nickname,
          this.playerController.frontendPlayers[this.socket.id].color
        );
      }
    });

    // update players event
    this.socket.on("updatePlayers", (backendPlayers) =>
      this.playerController.updatePlayers(backendPlayers)
    );

    // update chat event
    this.socket.on("updateChat", (nickname, color, message) => {
      this.chatController?.updateChat(nickname, color, message);
    });

    // update projectiles event
    this.socket.on("updateProjectiles", (backendProjectiles) => {
      this.projectileController.updateProjectiles(backendProjectiles);
    });
  }

  listenToClientEvents() {
    window.addEventListener("keydown", (event) => {
      if (this.chatController?.inputElement.dataset.focused) return;

      switch (event.code) {
        case "KeyW":
          this.playerController.moving.up = true;
          break;
        case "KeyA":
          this.playerController.moving.left = true;
          break;
        case "KeyS":
          this.playerController.moving.down = true;
          break;
        case "KeyD":
          this.playerController.moving.right = true;
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyW":
          this.playerController.moving.up = false;
          break;
        case "KeyA":
          this.playerController.moving.left = false;
          break;
        case "KeyS":
          this.playerController.moving.down = false;
          break;
        case "KeyD":
          this.playerController.moving.right = false;
          break;
      }
    });

    this.ctx.canvas.addEventListener("click", (event) => {
      const currentPlayer =
        this.playerController.frontendPlayers[this.socket.id];
      if (!currentPlayer) return;

      const clientX = event.clientX;
      const clientY = event.clientY;
      const playerX = currentPlayer.x;
      const playerY = currentPlayer.y;

      const xDif = clientX - playerX;
      const yDif = clientY - playerY;
      const angle = Math.atan2(yDif, xDif);

      this.socket.emit("createProjectile", angle);
    });
  }

  update() {
    this.playerController.update();
    this.projectileController.update();
  }

  render() {
    super.render();
    this.ctx.filter = "brightness(50%) blur(25px)";
    this.ctx.drawImage(
      this.background,
      100,
      200,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    );
    this.ctx.filter = "none";

    // rendering players
    this.playerController.render(this.ctx);

    // rendering projectiles
    this.projectileController.render(this.ctx);
  }
}
