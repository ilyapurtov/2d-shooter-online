import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    host: "148.253.208.167",
    port: 5000,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  worker: {
    format: "es",
  },
});
