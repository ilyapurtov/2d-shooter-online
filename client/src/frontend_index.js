import io from "socket.io-client";
import { config } from "./config";
import { Game } from "./Game";

// connecting to the server
const socket = io(config.serverURI);

// recieving config and running the game
socket.on("config", (config) => new Game(socket, config));
