import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import module from "module";
import fs from "fs";

const { dependencies, optionalDependencies } = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url)));

export default {
    input: [
        "src/index.js",
        "src/cli/cli.js",
        "src/modules/errors.js",
        "src/modules/database/mongoose.js",
    ],
    output: { dir: "dist", format: "cjs" },
    external: [...Object.keys(dependencies), ...Object.keys(optionalDependencies), ...module.builtinModules],
    plugins: [
        resolve(),
        commonjs(),
        json(),
        esbuild({ target: "node18" })
    ]
}