import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/extrator/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    // CJS has no import.meta.url. The shim maps it to the emitted file so the
    // schema next to dist/ can be found after publish.
    shims: true,
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    banner: { js: "#!/usr/bin/env node" },
  },
]);
