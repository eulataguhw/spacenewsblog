import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "../certs/localhost.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "../certs/localhost.crt")),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@app-types": path.resolve(__dirname, "./src/types"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@tests": path.resolve(__dirname, "./src/tests"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/tests/**/*.{ts,tsx}",
        "src/main.tsx",
        "src/App.tsx",
        "src/i18n/**",
        "src/styles/**",
        "src/types/**",
        "src/mocks/**",
        "src/api/**",
        "src/store/store.ts",
        "**/index.ts",
        "**/constants.ts",
        "**/useModel.ts", // Exclude hooks that are just placeholders/data mappers if they contain no logic
        "**/*.d.ts",
      ],
    },
  },
});
