import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/**/*.ts", "!src/**/*.test.ts"],
  format: ["esm"],
  clean: true,
  splitting: false,
  replaceNodeEnv: false,
  outExtension() {
    return { js: ".js" }
  },
})
