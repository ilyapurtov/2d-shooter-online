import { Projectile } from "../objects/Projectile";

export class ProjectileController {
  constructor({ config }) {
    this.frontendProjectiles = {};
    this.config = config;
  }

  updateProjectiles(backendProjectiles) {
    for (const id in backendProjectiles) {
      const backendProjectile = backendProjectiles[id];
      if (!this.frontendProjectiles[id]) {
        this.frontendProjectiles[id] = new Projectile({
          x: backendProjectile.x,
          y: backendProjectile.y,
          width: this.config.projectile.width,
          height: this.config.projectile.height,
          ownerId: backendProjectile.ownerId,
          speed: this.config.projectile.speed,
          texture: "#fff",
          velocity: backendProjectile.velocity,
        });
      } else {
        this.frontendProjectiles[id].x = backendProjectile.x;
        this.frontendProjectiles[id].y = backendProjectile.y;
      }
    }

    for (const id in this.frontendProjectiles) {
      if (!backendProjectiles[id]) {
        delete this.frontendProjectiles[id];
      }
    }
  }

  update() {
    for (const id in this.frontendProjectiles) {
      this.frontendProjectiles[id].update();
    }
  }

  render(ctx) {
    for (const id in this.frontendProjectiles) {
      this.frontendProjectiles[id].render(ctx);
    }
  }
}
