import { internalConfig } from "../internal.config.js";

export default class ServerPlugin {
  constructor(className, io) {
    this.className = className;
    this.io = io;
    this.pluginConfig = {};
  }

  // runs in plugin manager
  async init() {
    this.pluginConfig = (
      await import(
        "file://" +
          internalConfig.plugins.path +
          `/${this.className}/${this.className}_config.js`
      )
    ).pluginConfig;
  }

  onConnection(socket) {
    socket.on(`${this.className}.pluginConfig`, (callback) =>
      callback(this.pluginConfig)
    );
  }
}
