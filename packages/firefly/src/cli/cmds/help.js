import { firefly } from "../../utils/logging";

/* the list of commands with corresponding help menus */
const menus = {
    default: `
    Usage: ${firefly("firefly [command] <options>")}
    Options:
        ${firefly("-v, --version")} ........ Output the current version.
        ${firefly("-h, --help")} ........ Output the help menu.
    Commands:
        ${firefly("build")} <options> ........ Builds the Firefly application.
        ${firefly("lint")} <options> ........ Lints the Firefly application.
        ${firefly("start")} <options> ........ Starts the Firefly application.

    For help with a specific command run "firefly [command] --help"
    `,

    build: `
    Usage: ${firefly("firefly build <options>")}
    - Builds the Firefly application.

    Options:
        ${firefly("-d, --dev")} ........ Builds the Firefly application in dev mode.
    `,

    lint: `
    Usage: ${firefly("firefly lint <options>")}
    - Lints the Firefly application.

    Options:
        ${firefly("-f, --fix")} ........ Lints the Firefly application.
    `,

    start: `
    Usage: ${firefly("firefly start <options>")}
    - Starts the Firefly application.

    Options:
        ${firefly("-d, --dev")} ........ Starts the Firefly application in dev mode.
    `
};

/* print out the requested help menu */
export default function help(args) {
    const command = args._[0] == "help" ? args._[1] : args._[0];
    console.log(menus[command] || menus.default);
}