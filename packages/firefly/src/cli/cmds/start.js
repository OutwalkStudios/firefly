import chalk from "chalk";
import nodemon from "nodemon";
import { execSync } from "child_process";
import build from "./build";
import path from "path";
import fs from "fs";

/* build the project for production */
export default async function start(args) {
    const isDev = (args.dev || args.d);

    /* set the node environment */
    process.env.NODE_ENV = isDev ? "development" : "production";

    /* wait until a file exists */
    const wait = (pathname) => {
        const [directory, file] = pathname.split("/");

        return new Promise((resolve) => {
            fs.watch(directory, (event, filename) => {
                if (event == "rename" && filename == file) {
                    resolve();
                }
            });
        });
    };

    try {
        const { main } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")));
        const flags = ["-r dotenv/config"];

        if (!isDev) {
            return execSync(`node ${flags.join(" ")} ${main}`, { stdio: "inherit" });
        }

        flags.push(`--watch ${main}`);

        Promise.all([
            build(args),
            wait(main).then(() => nodemon(`${flags.join(" ")} ${main}`))
        ]);

        nodemon.on("crash", () => console.log(`${chalk.red("[firefly]")} - failed to reload the application.`));
        nodemon.on("quit", () => process.exit());

    } catch (error) {
        console.error(`${chalk.red("[firefly]")} - ${error.message}`);
    }
}