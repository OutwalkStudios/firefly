import chalk from "chalk";

/* build the project for production */
export default async function start(args) {

    /* set the node environment */
    process.env.NODE_ENV = args.dev ? "development" : "production";

    try {

    } catch (error) {
        console.error(chalk.red(`[ERROR]: ${error.message}`));
    }
}