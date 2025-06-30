import { GameObject } from "../engine/GameObject";

export class Projectile extends GameObject {
  constructor({ x, y, width, height, texture, ownerId, speed, velocity }) {
    super({ x, y, width, height, texture });
    this.ownerId = ownerId;
    this.speed = speed;
    this.velocity = velocity;

    // temp
    this.image = new Image();
    this.image.src = "/bullet.jpg";
  }

  render(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
