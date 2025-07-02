import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { startServerLoops, onConnection } from "./connection.js";
import { PluginController } from "./controllers/PluginController.js";
import { internalConfig } from "./internal.config.js";

// creating a server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `http://${internalConfig.client.host}:${internalConfig.client.port}`,
    methods: ["GET", "POST"],
  },
  pingInterval: 2000,
  pingTimeout: 10000,
});

// loading plugins
const pluginController = new PluginController(io);
pluginController.init().then(() => {
  // run server loops
  startServerLoops(io);

  // leading control to onConnection
  io.on("connection", (socket) => onConnection(io, socket));

  // running a server
  httpServer.listen(
    internalConfig.server.port,
    internalConfig.server.host,
    () => {
      console.log(
        `Server is running at http://${internalConfig.server.host}:${internalConfig.server.port}`
      );
    }
  );
});
