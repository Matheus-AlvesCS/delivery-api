import { defineConfig } from "tsup"

export default defineConfig({
  format: ["esm"],
  clean: true,
  splitting: false,
  replaceNodeEnv: false,
  outExtension() {
    return { js: ".js" }
  },
})
