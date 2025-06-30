import { config } from "../config.js";

export class ProjectileController {
  constructor() {
    this.backendProjectiles = {};
    this.projectileId = 0;
  }

  createProjectile(socketId, x, y, angle) {
    const velocity = {
      x: config.projectile.speed * Math.cos(angle),
      y: config.projectile.speed * Math.sin(angle),
    };
    this.backendProjectiles[this.projectileId] = {
      ownerId: socketId,
      x,
      y,
      velocity,
    };
    this.projectileId++;
  }

  moveProjectiles() {
    for (const id in this.backendProjectiles) {
      const backendProjectile = this.backendProjectiles[id];

      // moving projectile
      backendProjectile.x += backendProjectile.velocity.x;
      backendProjectile.y += backendProjectile.velocity.y;

      // checking if projectile is out of screen
      if (
        backendProjectile.x >= config.game.width ||
        backendProjectile.x <= -config.projectile.width ||
        backendProjectile.y <= -config.projectile.height ||
        backendProjectile.y >= config.game.height
      ) {
        delete this.backendProjectiles[id];
      }
    }
  }
}
