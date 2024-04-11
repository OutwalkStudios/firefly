import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import multi from "@rollup/plugin-multi-entry";
import esbuild from "rollup-plugin-esbuild";
import module from "module";
import fs from "fs";

const { dependencies, optionalDependencies } = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url)));

export default {
    input: ["src/index.js", "src/database/**/*.js"],
    output: [
        { dir: "dist/esm", format: "esm", preserveModules: true },
        { dir: "dist/cjs", format: "cjs", preserveModules: true },
    ],
    external: [...Object.keys(dependencies), ...Object.keys(optionalDependencies), ...module.builtinModules],
    plugins: [
        resolve(),
        commonjs(),
        json(),
        multi({ preserveModules: true }),
        esbuild({ target: "node18" })
    ]
}