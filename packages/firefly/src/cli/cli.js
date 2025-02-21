#!/usr/bin/env node

import "dotenv/config";

import yargs from "yargs-parser";
import version from "./cmds/version";
import help from "./cmds/help";
import build from "./cmds/build";
import lint from "./cmds/lint";
import start from "./cmds/start";

import { logger } from "../utils/logging";

/* parse the cli arguments */
const args = yargs(process.argv.slice(2));
let cmd = args._[0] || "help";

/* determine what command to run */
if (args.version || args.v) cmd = "version";
else if (args.help || args.h) cmd = "help";


const commands = {
    "version": version,
    "help": help,
    "build": build,
    "lint": lint,
    "start": start
};

try {
    if (commands[cmd]) commands[cmd](args);
} catch (error) {
    logger.error(error.message);
}