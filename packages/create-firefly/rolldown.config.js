import { defineConfig } from "rolldown";
import module from "node:module";
import fs from "node:fs";

const { dependencies } = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url)));
const prefixedModules = ["node:test", "node:test/reporters", "node:sqlite", "node:sea"];

export default defineConfig({
    input: "src/index.js",
    transform: { target: "node22" },
    output: { file: "dist/index.js", format: "esm" },
    external: [
        ...Object.keys(dependencies).map((dependency) => new RegExp("^" + dependency + "(\\/.+)*$")),
        ...module.builtinModules.map((m) => `node:${m}`),
        ...module.builtinModules,
        ...prefixedModules
    ]
});