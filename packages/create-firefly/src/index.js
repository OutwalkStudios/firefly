#!/usr/bin/env node

import yargs from "yargs-parser";
import prompts from "prompts";
import path from "node:path";
import fs from "node:fs";

import { logger, firefly } from "./utils/logging";
import { TemplateBuilder } from "./utils/template";
import { installDependencies, intitializeGitRepository } from "./utils/dependencies";

/* parse the cli arguments and preset any prompt values */
const args = yargs(process.argv.slice(2));
prompts.override({
    name: args._[0],
    language: args.l ?? args.language,
    platform: args.p ?? args.platform,
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
            { title: "Hono", value: "hono,@hono/node-server" }
        ]
    }
];

(async () => {
    const config = await prompts(questions, { onCancel: () => process.exit() });
    const skipInstall = args["skip-install"];
    const skipGit = args["skip-git"];
    const force = args["force"];

    const settings = { useCurrentDirectory: false };
    const dependencies = ["@outwalk/firefly"];

    /* add the language dependency if its an npm package */
    if (config.language != "javascript") {
        dependencies.push(config.language);
    }

    /* add the platform to dependencies */
    dependencies.push(...config.platform.split(","));

    /* change the project name when generating in the current directory */
    if (config.name == ".") {
        if (!force && fs.readdirSync(config.name).length > 0) {
            const response = await prompts({
                type: "confirm",
                name: "continue",
                message: "The current directory is not empty. Continue?",
                initial: true
            });

            if (!response.continue) return;
        }

        config.name = path.basename(process.cwd());
        settings.useCurrentDirectory = true;
    }

    /* check if the project directory already exists */
    if (fs.existsSync(config.name)) {
        if (force && !settings.useCurrentDirectory) {
            TemplateBuilder.deleteDirectory(config.name);
        } else {
            logger.error(`${config.name} already exists.`);
            return;
        }
    }

    console.log("\n");
    logger.log(`creating ${config.name}...`);

    /* find the template paths */
    const templatePath = path.join(__dirname, "../templates/", config.language);
    const snippetPath = path.join(__dirname, "../templates/snippets");
    const projectPath = !settings.useCurrentDirectory ? config.name : ".";

    /* Start copying template files to the destination */
    try {
        const template = new TemplateBuilder(templatePath, projectPath);

        /* inject global template variables */
        template.inject("project-name", config.name);

        /* apply platform snippets to the template */
        template.snippet("import-platform", path.join(snippetPath, config.platform, "import-platform.template"));
        template.snippet("define-platform", path.join(snippetPath, config.platform, "define-platform.template"));

        template.build();
    } catch (error) {
        logger.error(error.message);
        return;
    }

    /* initialize the project depending on what the cli flags have enabled */
    try {
        if (!skipInstall) await installDependencies(dependencies, projectPath);
        if (!skipGit) await intitializeGitRepository(projectPath);
    } catch (error) {
        logger.error(error.message);
        if (!settings.useCurrentDirectory) TemplateBuilder.deleteDirectory(config.name);
        return;
    }

    console.log("\n----------------------------------");
    console.log("Get started with your new project!\n");
    if (!settings.useCurrentDirectory) {
        console.log(firefly(` > cd ./${path.relative(process.cwd(), config.name)} `));
    }

    if (skipInstall) console.log(firefly(" > npm install"));
    console.log(firefly(" > npm run dev"));

    console.log("----------------------------------");

})();