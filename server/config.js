export const config = {
  game: {
    width: 1280,
    height: 720,
    fps: 60,
  },
  player: {
    width: 100,
    height: 100,
    speed: 8,
    nickname: {
      maxLength: 20,
    },
    skinsAvailable: 6,
    defaultSkin: 1,
    skinsURL: "http://localhost:5173/skins",
  },
  projectile: {
    width: 30,
    height: 30,
    speed: 10,
  },
  chat: {
    maxLength: 100,
  },
};
