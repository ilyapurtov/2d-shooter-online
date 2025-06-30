export class Player {
  constructor({ x, y, width, height, color, nickname, skin }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.nickname = nickname;
    this.skin = skin;
  }

  render(ctx) {
    // displaying player
    ctx.drawImage(
      this.skin,
      0,
      20,
      this.skin.width,
      this.skin.height - 20,
      this.x,
      this.y,
      this.width,
      this.height
    );

    // displaying nickname
    ctx.fillStyle = this.color;
    ctx.textAlign = "center";
    ctx.font = "25px Handjet";
    ctx.fillText(this.nickname, this.x + this.width / 2, this.y - 16);
  }
}
