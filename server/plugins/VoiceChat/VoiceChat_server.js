import ServerPlugin from "../ServerPlugin.js";

export class VoiceChat extends ServerPlugin {
  constructor(className, io) {
    super(className, io);
  }

  onConnection(socket) {
    super.onConnection(socket);

    console.log("voicechat connection event!");
    this.registerSocketEvents(socket);
  }

  registerSocketEvents(socket) {
    socket.on(`${this.className}.audioStream`, (stream) => {
      socket.broadcast.emit(`${this.className}.audioStream`, stream);
    });

    socket.on(`${this.className}.audioStreamStart`, () => {
      this.io.emit(`${this.className}.audioStreamStart`, socket.id);
    });
    socket.on(`${this.className}.audioStreamEnd`, () => {
      this.io.emit(`${this.className}.audioStreamEnd`, socket.id);
    });
  }
}
