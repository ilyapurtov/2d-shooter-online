import { config } from "../config.js";
export class UserInputController {
  constructor() {}

  validateNickname(nickname) {
    nickname = nickname.trim();
    if (nickname.length > config.player.nickname.maxLength) {
      return nickname.slice(0, config.player.nickname.maxLength - 1);
    } else {
      return nickname;
    }
  }

  validateMessage(msg) {
    if (msg.length > config.chat.maxLength) {
      return msg.slice(0, config.chat.maxLength - 1);
    } else {
      return msg;
    }
  }

  validateSkinNumber(skinNumber) {
    if (
      !isNaN(skinNumber) &&
      skinNumber >= 1 &&
      skinNumber <= config.player.skinsAvailable
    ) {
      return skinNumber;
    } else {
      return config.player.defaultSkin;
    }
  }
}
