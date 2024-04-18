import { globSync } from "glob";
import module from "module";
import rollup from "rollup";
import chalk from "chalk";
import path from "path";
import fs from "fs";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import { typescriptPaths } from "rollup-plugin-typescript-paths";


const green = chalk.hex("#ADFF2F");

/* build the project for production */
export default async function build() {

    /* set the node environment */
    process.env.NODE_ENV = process.env.NODE_ENV ?? "production";

    try {
        console.log(`${green("[firefly]")} - building the project...`);

        /* get the projects package.json and determine language */
        const { engines, dependencies } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")));
        const isTypeScript = fs.existsSync(path.join(process.cwd(), "tsconfig.json"));

        /* determine the node version being targeted */
        const [version] = (engines?.node ?? process.versions.node.split(".")[0]).match(/\d+[^.\|]/g);

        /* determine the input files */
        const files = globSync("src/**/*.{js,ts}").map((file) => [
            path.relative("src", file.slice(0, file.length - path.extname(file).length)),
            path.join(process.cwd(), file)
        ]);

        const config = {
            input: Object.fromEntries(files),
            output: { dir: "dist", format: "cjs" },
            external: [
                ...Object.keys(dependencies).map((dependency) => new RegExp("^" + dependency + "(\\/.+)*$")),
                ...module.builtinModules
            ],
            plugins: [
                esbuild.default({ target: `node${version}`, loaders: { ".js": "ts" }, tsconfig: isTypeScript ? "tsconfig.json" : "jsconfig.json" }),
                typescriptPaths({ tsConfigPath: path.join(process.cwd(), isTypeScript ? "tsconfig.json" : "jsconfig.json") }),
                resolve(),
                commonjs(),
                json(),
            ]
        };

        /* create the build and write it to disk */
        const bundle = await rollup.rollup(config);
        await bundle.write(config.output);
        await bundle.close();

        console.log(`${green("[firefly]")} - build completed.`);
    } catch (error) {
        console.error(`${chalk.red("[firefly]")} - ${error.message}`);
        if (error.frame) console.log(error.frame);

        throw error;
    }
}