export class Scene {
  constructor({
    ctx,
    width,
    height,
    fps,
    UIContainer = null,
    onDestroy = () => {},
  }) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.fps = fps;
    this.UIContainer = UIContainer;
    this.destroyed = false;
    this.onDestroy = onDestroy;
  }

  start() {
    // showing ui
    this.UIContainer && (this.UIContainer.style.display = "block");

    // starting render loop
    this.render();

    // starting movement loop
    this.updateInterval = setInterval(() => this.update(), 1000 / this.fps);
  }

  update() {}

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (!this.destroyed) {
      requestAnimationFrame(() => this.render());
    }
  }

  destroy(...params) {
    // hiding ui
    this.UIContainer && (this.UIContainer.style.display = "none");

    // clearing interval
    clearInterval(this.updateInterval);
    this.destroyed = true;

    // calling onDestroy event
    this.onDestroy(...params);
  }
}
