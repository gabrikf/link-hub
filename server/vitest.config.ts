import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // allows using describe, it, expect globally
    environment: "node",
  },
});
