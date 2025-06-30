export class GameObject {
  constructor({ x, y, width, height, texture }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.texture = texture;
  }

  update() {}

  render(ctx) {
    ctx.fillStyle = this.texture;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
