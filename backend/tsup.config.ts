import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  clean: true,
  sourcemap: true,
  splitting: false,
  target: "es2024",
});
