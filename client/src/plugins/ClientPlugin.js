export class ClientPlugin {
  constructor(className, socket) {
    this.className = className;
    this.socket = socket;
    this.pluginConfig = {};
  }

  // plugin initialization
  init() {
    // requesting plugin config
    this.socket.emit(`${this.className}.pluginConfig`, (pluginConfig) => {
      this.pluginConfig = pluginConfig;
      this.onLoad();
    });
  }

  // onLoad is called when pluginConfig is available
  onLoad() {}
}
