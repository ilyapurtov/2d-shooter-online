import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { startServerLoops, onConnection } from "./connection.js";

// creating a server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  pingInterval: 2000,
  pingTimeout: 10000,
});

// run server loops
startServerLoops(io);

// leading control to onConnection
io.on("connection", (socket) => onConnection(io, socket));

// running a server
httpServer.listen(3000, "127.0.0.1", () => {
  console.log("Server is running at http://127.0.0.1:3000");
});
