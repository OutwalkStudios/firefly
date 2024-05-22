import { globSync } from "glob";
import module from "module";
import rollup from "rollup";
import chokidar from "chokidar";
import path from "path";
import fs from "fs";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import esbuild from "rollup-plugin-esbuild";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

import { loadPackage, deleteDirectory } from "../../utils/files";
import { logger } from "../../utils/logging";

/* build the project for production */
export default async function build(args) {
    const isDev = (args.dev || args.d);

    /* set the node environment */
    process.env.NODE_ENV = isDev ? "development" : "production";

    try {
        logger.log("building the project...");

        /* get the projects package.json and determine language */
        const { main, engines, dependencies } = loadPackage();
        const isTypeScript = fs.existsSync(path.join(process.cwd(), "tsconfig.json"));
        const dist = main.split("/")[0];

        /* determine the node version being targeted */
        const [version] = (engines?.node ?? process.versions.node.split(".")[0]).match(/\d+[^.|]/g);

        /* delete existing files in the dist folder */
        deleteDirectory(dist, false);

        /* determine the input files */
        const findInputFiles = () => {
            const files = globSync("src/**/*.{js,ts}", { ignore: "src/**/*.d.ts" }).map((file) => [
                path.relative("src", file.slice(0, file.length - path.extname(file).length)),
                path.join(process.cwd(), file)
            ]);

            return Object.fromEntries(files);
        };

        const config = {
            input: findInputFiles(),
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
                json()
            ]
        };

        /* if building for production build and write it to disk */
        if (!isDev) {
            const bundle = await rollup.rollup(config);
            await bundle.write(config.output);
            await bundle.close();

            logger.log("build completed.");
            return;
        }

        /* if building for development, watch for changes */
        const startWatchMode = () => {
            config.input = findInputFiles();
            config.watch = { exclude: "node_modules/**" };
            const watcher = rollup.watch(config);

            watcher.on("event", (event) => {
                switch (event.code) {
                    case "BUNDLE_END":
                        logger.log("build completed.");
                        event.result.close();
                        break;

                    case "ERROR":
                        logger.error(event.error.message);
                        if (event.error.frame) console.log(event.error.frame);
                        break;

                    case "FATAL":
                        logger.error("fatal error occurred.");
                        process.exit(1);
                }
            });

            /* detect when a file is added or removed and restart the process */
            const fsWatcher = chokidar.watch("src/**", { ignoreInitial: true });
            const restart = () => watcher.close().then(() => fsWatcher.close()).then(startWatchMode);

            fsWatcher.on("add", restart);
            fsWatcher.on("unlink", restart);
        };

        startWatchMode();

    } catch (error) {
        logger.error(error.message);
        if (error.frame) console.log(error.frame);
    }
}