import build from "./build";
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

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
        const flags = ["-r dotenv/config", ...(isDev ? ["--watch"] : [])];

        if (isDev) await Promise.all([build(args), wait(main)]);
        execSync(`node ${flags.join(" ")} ${main}`, { stdio: "inherit" });
    } catch (error) {
        logger.error(error.message);
    }
}