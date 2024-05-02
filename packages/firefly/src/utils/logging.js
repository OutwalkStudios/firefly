import chalk from "chalk";

export const firefly = chalk.hex("#ADFF2F");

export const logger = {
    log: (...message) => console.log(`${firefly("[firefly]")} - `, ...message),
    warn: (...message) => console.log(`${chalk.yellow("[firefly]")} - `, ...message),
    error: (...message) => console.log(`${chalk.red("[firefly]")} - `, ...message)
};