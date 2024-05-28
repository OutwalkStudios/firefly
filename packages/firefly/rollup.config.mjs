import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import module from "module";
import fs from "fs";

const { dependencies, peerDependencies } = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url)));

export default {
    input: [
        "src/index.js",
        "src/cli/cli.js",
        "src/modules/errors.js",
        "src/modules/platform/express.js",
        "src/modules/database/mongoose.js",
    ],
    output: [
        { dir: "dist/cjs", format: "cjs", entryFileNames: "[name].cjs", chunkFileNames: "[name].cjs" },
        { dir: "dist/esm", format: "esm", entryFileNames: "[name].js", chunkFileNames: "[name].js" }
    ],
    external: [
        ...Object.keys(dependencies).map((dependency) => new RegExp("^" + dependency + "(\\/.+)*$")),
        ...Object.keys(peerDependencies).map((dependency) => new RegExp("^" + dependency + "(\\/.+)*$")),
        ...module.builtinModules
    ],
    plugins: [
        resolve(),
        commonjs(),
        json(),
        esbuild({ target: "node18" })
    ]
}