#!/usr/bin/env node

import yargs from "yargs-parser";
import version from "./cmds/version";
import help from "./cmds/help";
import build from "./cmds/build";
import start from "./cmds/start";

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
    "start": start
};

if (commands[cmd]) commands[cmd](args);