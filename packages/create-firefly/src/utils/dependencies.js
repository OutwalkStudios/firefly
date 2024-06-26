import { spawnSync, exec } from "child_process";

import { logger } from "./logging";

/* install the dependencies required for a project */
export function installDependencies(dependencies, directory) {
    return new Promise((resolve, reject) => {
        logger.log("installing dependencies...");

        const command = /^win/.test(process.platform) ? "npm.cmd" : "npm";

        /* spawn the child process and handle errors */
        const spawnProcess = (command, args) => {
            const { status, error } = spawnSync(command, args, { cwd: directory, stdio: "ignore" });
            if (status != 0) throw new Error("failed to install project dependencies.");
            if (error) throw error;
        };

        try {
            spawnProcess(command, ["install", "--save"].concat(dependencies));
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/* intitialize a git repository */
export function intitializeGitRepository(directory) {
    return new Promise((resolve, reject) => {
        logger.log("initializing git repository...");

        try {
            exec("git init", { cwd: directory });
            resolve();
        } catch {
            reject(new Error("failed to initialize the git repository."));
        }

    });
}