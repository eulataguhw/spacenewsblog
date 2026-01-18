import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: {
      DATABASE_URL: "postgres://localhost:5432/dummy",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "src/scripts/**",
        "src/__tests__/**",
        "**/server.ts",
        "**/prismaClient.ts",
        "**/generate-cert.ts",
        "src/types/**",
        "src/constants/**",
        "src/routes/**",
      ],
    },
  },
});
