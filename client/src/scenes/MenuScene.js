import { Scene } from "../engine/Scene";
import "../styles/menu-scene.css";

export class MenuScene extends Scene {
  constructor({ ctx, width, height, socket, config, onDestroy }) {
    super({
      ctx,
      width,
      height,
      fps: config.game.fps,
      UIContainer: document.getElementById("menu-scene-ui"),
      onDestroy,
    });
    this.socket = socket;
    this.config = config;

    // setting up DOM elements
    this.formElement = this.UIContainer.querySelector("#menu-form");
    this.nicknameInputElement = this.UIContainer.querySelector("#nickname");
    this.skinSelectElement = this.UIContainer.querySelector("#skin-select");

    this.initNickname();
    this.initSkins();
    this.listenToEvents();
  }

  initNickname() {
    const nickname =
      localStorage.getItem("nickname") || this.generateRandomNickname();
    this.nicknameInputElement.value = nickname;
  }

  initSkins() {
    for (let i = 1; i <= this.config.player.skinsAvailable; i++) {
      const skinSelectItem = document.createElement("li");
      skinSelectItem.classList.add("skin-select__item");
      if (i == this.config.player.defaultSkin) {
        skinSelectItem.classList.add("active");
      }
      skinSelectItem.dataset.number = i;

      const skinImage = new Image();
      skinImage.src = this.config.player.skinsURL + `/player${i}.jpg`;
      skinImage.alt = `SKIN ${i}`;
      skinSelectItem.appendChild(skinImage);

      skinSelectItem.addEventListener("click", () => {
        if (!skinSelectItem.classList.contains("active")) {
          this.UIContainer.querySelector(
            ".skin-select__item.active"
          )?.classList.remove("active");
          skinSelectItem.classList.add("active");
        }
      });

      this.skinSelectElement.appendChild(skinSelectItem);
    }
  }

  listenToEvents() {
    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      const nickname = this.nicknameInputElement.value;
      const skinNumber = this.UIContainer.querySelector(
        ".skin-select__item.active"
      ).dataset.number;

      localStorage.setItem("nickname", nickname);

      this.destroy(nickname, skinNumber);
    });
  }

  generateRandomNickname() {
    return "anonymous-" + Math.round(1000 * Math.random());
  }
}
