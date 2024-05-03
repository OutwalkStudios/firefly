import nodemon from "nodemon";
import { execSync } from "child_process";
import build from "./build";
import path from "path";
import fs from "fs";

import { loadPackage } from "../../utils/files";
import { logger } from "../../utils/logging";

/* build the project for production */
export default async function start(args) {
    const isDev = (args.dev || args.d);

    /* set the node environment */
    process.env.NODE_ENV = isDev ? "development" : "production";

    /* wait until a file exists */
    const wait = (pathname) => {
        return new Promise((resolve) => {
            /* if the directory does not yet exist, we need to create it */
            if (!fs.existsSync(path.dirname(pathname))) {
                fs.mkdirSync(path.dirname(pathname));
            }

            const watcher = fs.watch(path.dirname(pathname), (event, filename) => {
                if (event == "rename" && filename == path.basename(pathname)) {
                    if (fs.existsSync(pathname)) {
                        watcher.close();
                        resolve();
                    }
                }
            });
        });
    };

    try {
        const { main } = loadPackage();
        const flags = ["-r dotenv/config"];

        if (!isDev) {
            return execSync(`node ${flags.join(" ")} ${main}`, { stdio: "inherit" });
        }

        flags.push(`--watch ${main}`);

        Promise.all([
            build(args),
            wait(main).then(() => {
                nodemon(`${flags.join(" ")} ${main}`);

                nodemon.once("restart", () => process.env.FIREFLY_DISABLE_LOGGING = true);
                nodemon.on("crash", () => logger.error("failed to reload the application."));
                nodemon.on("quit", () => process.exit());
            })
        ]);

    } catch (error) {
        logger.error(error.message);
    }
}