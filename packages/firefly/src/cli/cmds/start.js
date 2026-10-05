import build from "./build";
import { execSync, spawn } from "node:child_process";
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
        const flags = ["-r", "dotenv/config", ...(isDev ? ["--watch", "--watch-preserve-output"] : [])];

        if (!isDev) return execSync(`node ${flags.join(" ")} ${main}`, { stdio: "inherit" });

        Promise.all([build(args), wait(main).then(() => {
            const child = spawn("node", [...flags, main], { env: { ...process.env, FORCE_COLOR: "1" } });
            child.stdout.on("data", (data) => data.toString().includes(`Restarting '${main}'`) || process.stdout.write(data.toString()));
            child.stderr.pipe(process.stderr);
            child.on("error", () => logger.error("failed to reload the application."));
            child.on("exit", () => process.exit());
        })]);

    } catch (error) {
        logger.error(error.message);
    }
}