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
import del from "rollup-plugin-delete";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

const green = chalk.hex("#ADFF2F");

/* build the project for production */
export default async function build(args) {
    const isDev = (args.dev || args.d);

    /* set the node environment */
    process.env.NODE_ENV = isDev ? "development" : "production";

    try {
        console.log(`${green("[firefly]")} - building the project...`);

        /* get the projects package.json and determine language */
        const { main, engines, dependencies } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")));
        const isTypeScript = fs.existsSync(path.join(process.cwd(), "tsconfig.json"));
        const dist = main.split("/")[0];

        /* determine the node version being targeted */
        const [version] = (engines?.node ?? process.versions.node.split(".")[0]).match(/\d+[^.|]/g);

        /* determine the input files */
        const files = globSync("src/**/*.{js,ts}").map((file) => [
            path.relative("src", file.slice(0, file.length - path.extname(file).length)),
            path.join(process.cwd(), file)
        ]);

        const config = {
            input: Object.fromEntries(files),
            output: { dir: dist, format: "cjs" },
            external: [
                ...Object.keys(dependencies).map((dependency) => new RegExp("^" + dependency + "(\\/.+)*$")),
                ...module.builtinModules
            ],
            plugins: [
                esbuild.default({ target: `node${version}`, loaders: { ".js": "ts" }, tsconfig: isTypeScript ? "tsconfig.json" : "jsconfig.json" }),
                typescriptPaths({ preserveExtensions: true, tsConfigPath: path.join(process.cwd(), isTypeScript ? "tsconfig.json" : "jsconfig.json") }),
                resolve(),
                commonjs(),
                json(),
                del({ targets: `${dist}/*`, runOnce: isDev })
            ]
        };

        /* if building for production build and write it to disk */
        if (!isDev) {
            const bundle = await rollup.rollup(config);
            await bundle.write(config.output);
            await bundle.close();

            console.log(`${green("[firefly]")} - build completed.`);
            return;
        }

        /* if building for development, watch for changes */
        config.watch = { exclude: "node_modules/**" };
        const watcher = rollup.watch(config);

        watcher.on("event", (event) => {
            switch(event.code) {
                case "BUNDLE_END":
                    console.log(`${green("[firefly]")} - build completed.`);
                    event.result.close();
                    break;
                
                case "ERROR":
                    console.log(`${chalk.red("[firefly]")} - ${event.error.message}`);
                    if (event.error.frame) console.log(event.error.frame);
                    break;

                case "FATAL":
                    console.log(`${chalk.red("[firefly]")} - Fatal Error Occurred.`);
                    process.exit(1);
            }
        });

    } catch (error) {
        console.error(`${chalk.red("[firefly]")} - ${error.message}`);
        if (error.frame) console.log(error.frame);
    }
}