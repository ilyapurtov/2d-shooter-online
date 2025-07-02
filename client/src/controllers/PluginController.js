export class PluginController {
  constructor({ socket, config }) {
    this.socket = socket;
    this.config = config;
    this.plugins = {};
  }

  async init() {
    await this.loadPlugins();
    this.initPlugins();
  }

  initPlugins() {
    for (const className in this.plugins) {
      const plugin = this.plugins[className];
      plugin.init();
    }
  }

  async loadPlugins() {
    for (const className of this.config.plugins) {
      await this.loadPlugin(className);
      console.log(`[Plugins] ${className} loaded`);
    }
  }

  async loadPlugin(className) {
    const plugin = await import(
      `../plugins/${className}/${className}_client.js`
    );
    this.plugins[className] = new plugin[className](className, this.socket);
  }
}
