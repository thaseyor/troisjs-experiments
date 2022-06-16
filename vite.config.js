import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");

export default defineConfig({
  assetsInclude: ["**/*.fbx"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [vue()],
});
