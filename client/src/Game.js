import "./styles/main.css";
import { GameScene } from "./scenes/GameScene";
import { MenuScene } from "./scenes/MenuScene";

export class Game {
  constructor(socket, config) {
    this.socket = socket;
    this.config = config;

    // setting up canvas
    this.canvas = document.getElementById("game");
    this.canvas.width = config.game.width;
    this.canvas.height = config.game.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    // setting up online counter
    this.onlineCounterElement = document.getElementById("online-counter");
    this.onlineCounterElement.style.display = "block";

    // setting up preloader screen
    // initializing preloader screen
    this.preloaderElement = document.createElement("div");
    this.preloaderElement.classList.add("preloader");
    this.preloaderElement.innerText = "Загрузка...";
    this.showPreloader();
    document.body.appendChild(this.preloaderElement);

    // setting background image
    this.background = new Image();
    this.background.src = "/background.jpg";
    this.background.onload = () => {
      // showing menu
      this.startMenu();
    };

    this.listenToServerEvents();
  }

  listenToServerEvents() {
    this.socket.on("countPlayers", (count) => {
      this.onlineCounterElement.innerText = `Онлайн: ${count}`;
    });
  }

  startMenu() {
    // setting up menu
    this.scene = new MenuScene({
      ctx: this.ctx,
      width: this.canvas.width,
      height: this.canvas.height,
      socket: this.socket,
      config: this.config,
      onDestroy: (nickname, skinNumber) => {
        this.socket.emit("joinPlayer", nickname, skinNumber);
        this.startGame();
      },
    });

    this.scene.start();
    this.hidePreloader();
  }

  startGame() {
    this.showPreloader();
    this.scene = new GameScene({
      ctx: this.ctx,
      width: this.canvas.width,
      height: this.canvas.height,
      background: this.background,
      socket: this.socket,
      config: this.config,
    });
    this.scene.start();
    this.hidePreloader();
  }

  showPreloader() {
    this.preloaderElement.style.display = "block";
  }

  hidePreloader() {
    this.preloaderElement.style.display = "none";
  }
}
