import { config } from "./config.js";
import { UserInputController } from "./controllers/UserInputController.js";
import { PlayerController } from "./controllers/PlayerController.js";
import { ProjectileController } from "./controllers/ProjectileController.js";

const playerController = new PlayerController();
const userInputController = new UserInputController();
const projectileController = new ProjectileController();

export function onConnection(io, socket) {
  console.log(`Client ${socket.id} connected`);

  // providing game config to a client
  socket.emit("config", config);

  // updating online counter
  socket.emit("countPlayers", playerController.getPlayersCount());

  socket.on("joinPlayer", (nickname, skinNumber) => {
    // adding new player
    playerController.addPlayer(
      socket.id,
      userInputController.validateNickname(nickname),
      userInputController.validateSkinNumber(skinNumber)
    );

    // updating players for all clients
    io.emit("updatePlayers", playerController.backendPlayers);

    // updating online counter
    io.emit("countPlayers", playerController.getPlayersCount());
  });

  // recieving moving packages
  socket.on("movePlayer", (sequenceNumber, direction) =>
    playerController.movePlayer(socket.id, sequenceNumber, direction)
  );

  // recieving message in chat
  socket.on("sendMessage", (nickname, color, message) => {
    const msg = userInputController.validateMessage(message);
    io.emit("updateChat", nickname, color, msg);
  });

  // recieveing projectile
  socket.on("createProjectile", (angle) => {
    const player = playerController.backendPlayers[socket.id];
    projectileController.createProjectile(
      socket.id,
      player.x + config.player.width / 2,
      player.y + config.player.height / 2,
      angle
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client ${socket.id} disconnected. Reason: ${reason}`);
    playerController.removePlayer(socket.id);

    // updating online counter
    io.emit("countPlayers", playerController.getPlayersCount());

    // updating players
    io.emit("updatePlayers", playerController.backendPlayers);
  });
}

export function startServerLoops(io) {
  // main loop
  setInterval(() => {
    io.emit("updatePlayers", playerController.backendPlayers);

    projectileController.moveProjectiles();

    io.emit("updateProjectiles", projectileController.backendProjectiles);
  }, 1000 / config.game.fps);
}
