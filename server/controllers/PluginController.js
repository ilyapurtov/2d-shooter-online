import { internalConfig } from "../internal.config.js";

export class PluginController {
  constructor(io) {
    this.io = io;
    this.plugins = {};
  }

  async init() {
    await this.loadPlugins();
    await this.initPlugins();
  }

  async initPlugins() {
    for (const className in this.plugins) {
      const plugin = this.plugins[className];
      await plugin.init();

      this.io.on("connection", (socket) => plugin.onConnection(socket));
    }
  }

  async loadPlugins() {
    for (const className of internalConfig.plugins.list) {
      await this.loadPlugin(className);
      console.log(`[Plugins] ${className} loaded`);
    }
  }

  async loadPlugin(className) {
    const plugin = await import(
      "file://" +
        internalConfig.plugins.path +
        `/${className}/${className}_server.js`
    );
    this.plugins[className] = new plugin[className](className, this.io);
  }
}
