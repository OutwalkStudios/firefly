import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import module from "module";
import fs from "fs";

const { dependencies } = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url)));
const prefixedModules = ["node:test", "node:test/reporters", "node:sqlite", "node:sea"];

export default {
    input: "src/index.js",
    output: { file: "dist/index.js", format: "cjs" },
    external: [
        ...Object.keys(dependencies).map((dependency) => new RegExp("^" + dependency + "(\\/.+)*$")),
        ...module.builtinModules.map((m) => `node:${m}`),
        ...module.builtinModules,
        ...prefixedModules
    ],
    plugins: [
        resolve(),
        commonjs(),
        json(),
        esbuild({ target: "node22" })
    ]
}