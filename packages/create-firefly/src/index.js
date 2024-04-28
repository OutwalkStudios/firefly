import yargs from "yargs-parser";
import prompts from "prompts";
import chalk from "chalk";
import path from "path";
import fs from "fs";

import { deleteDirectory, createDirectory, copyTemplate, injectSnippet } from "./utils/template";
import { installDependencies, intitializeGitRepository } from "./utils/dependencies";

/* set the firefly hex code */
const firefly = chalk.hex("#ADFF2F");

/* parse the cli arguments and preset any prompt values */
const args = yargs(process.argv.slice(2));
prompts.override({
    name: args._[0],
    language: args.l ?? args.language,
    platform: args.p ?? args.platform,
    database: args.d ?? args.database
});

/* questions for project creation */
const questions = [
    {
        type: "text",
        name: "name",
        message: "Project name:",
        validate: (name) => name != name.toLowerCase() ? "your project name must be lowercase." : true
    },
    {
        type: "select",
        name: "language",
        message: "Select a language:",
        choices: [
            { title: "JavaScript", value: "javascript" },
            { title: "TypeScript", value: "typescript" }
        ]
    },
    {
        type: "select",
        name: "platform",
        message: "Select a platform:",
        choices: [
            { title: "Express", value: "express" },
            { title: "Custom", value: "custom-platform" }
        ]
    },
    {
        type: "select",
        name: "database",
        message: "Select a database:",
        choices: [
            { title: "Mongoose", value: "mongoose" },
            { title: "Custom", value: "custom-database" },
            { title: "None", value: "none" }
        ]
    }
];

(async () => {
    const config = await prompts(questions, { onCancel: () => process.exit() });
    const skipInstall = args["skip-install"];
    const skipGit = args["skip-git"];
    const force = args["force"];

    /* find the template paths */
    const template = path.join(__dirname, "../templates/", config.language);
    const snippets = path.join(__dirname, "../templates/snippets");

    const dependencies = ["@outwalk/firefly"];

    /* add the platform to dependencies if its an npm package */
    if (!["none", "custom-platform"].includes(config.platform)) {
        dependencies.push(config.platform);
    }

    /* add the database to dependencies if its an npm package */
    if (!["none", "custom-database"].includes(config.database)) {
        dependencies.push(config.database);
    }

    /* check if the project directory already exists */
    if (fs.existsSync(config.name)) {
        if (force) deleteDirectory(config.name);
        else {
            console.error(`${chalk.red("[firefly]")} - ${config.name} already exists.`);
            return;
        }
    }

    console.log(`\n${firefly("[firefly]")} - creating ${config.name}...`);

    /* Start copying template files to the destination */
    try {
        createDirectory(config.name);
        copyTemplate(template, config.name, {
            "project-name": config.name,
            "import-platform": injectSnippet(snippets, config.platform, "import-platform"),
            "define-platform": injectSnippet(snippets, config.platform, "define-platform"),
            "import-database": injectSnippet(snippets, config.database, "import-database"),
            "define-database": injectSnippet(snippets, config.database, "define-database"),
            "define-options": `{ platform${config.database != "none" ? ", database" : ""} }`
        });
    } catch (error) {
        console.error(`${chalk.red("[firefly]")} - ${error.message}`);
        return;
    }

    /* initialize the project depending on what the cli flags have enabled */
    try {
        if (!skipInstall) await installDependencies(dependencies, config.name);
        if (!skipGit) await intitializeGitRepository(config.name);
    } catch (error) {
        console.error(`${chalk.red("[firefly]")} - ${error.message}`);
        deleteDirectory(config.name);
        return;
    }

    console.log("\n----------------------------------");
    console.log("Get started with your new project!\n");
    console.log(firefly(` > cd ./${path.relative(process.cwd(), config.name)} `));

    if (skipInstall) console.log(firefly(" > npm install"));
    console.log(firefly(" > npm run dev"));

    console.log("----------------------------------");

})();