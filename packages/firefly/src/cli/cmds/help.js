import chalk from "chalk";

const green = chalk.hex("#ADFF2F");

/* the list of commands with corresponding help menus */
const menus = {
    default: `
    Usage: ${green("firefly [command] <options>")}
    Options:
        ${green("-v, --version")} ........ Output the current version.
        ${green("-h, --help")} ........ Output the help menu.
    Commands:
        ${green("build")} <options> ........ Builds the Firefly application.
        ${green("start")} <options> ........ Starts the Firefly application.

    For help with a specific command run "firefly [command] --help"
    `,

    build: `
    Usage: ${green("firefly build <options>")}
    - Builds the Firefly application.
    `,

    start: `
    Usage: ${green("firefly start <options>")}
    - Starts the Firefly application.

    Options:
        ${green("-d, --dev")} ........ Starts the Firefly application in dev mode.
    `
};

/* print out the requested help menu */
export default function help(args) {
    const command = args._[0] == "help" ? args._[1] : args._[0];
    console.log(menus[command] || menus.default);
}