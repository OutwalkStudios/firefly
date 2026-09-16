import { defineConfig } from "rolldown";
import module from "node:module";
import fs from "node:fs";

const { dependencies, peerDependencies } = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url)));
const prefixedModules = ["node:test", "node:test/reporters", "node:sqlite", "node:sea"];

export default defineConfig({
    input: [
        "src/index.js",
        "src/cli/cli.js",
        "src/modules/eslint.js",
        "src/modules/events.js",
        "src/modules/errors.js",
        "src/modules/platform/express.js",
    ],
    output: [
        { dir: "dist/cjs", format: "cjs", entryFileNames: "[name].cjs", chunkFileNames: "[name].cjs" },
        { dir: "dist/esm", format: "esm", entryFileNames: "[name].js", chunkFileNames: "[name].js" }
    ],
    external: [
        ...Object.keys(dependencies).map((dependency) => new RegExp("^" + dependency + "(\\/.+)*$")),
        ...Object.keys(peerDependencies).map((dependency) => new RegExp("^" + dependency + "(\\/.+)*$")),
        ...module.builtinModules.map((m) => `node:${m}`),
        ...module.builtinModules,
        ...prefixedModules
    ],
    transform: { target: "node22" }
});