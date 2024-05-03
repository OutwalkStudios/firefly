#!/usr/bin/env node

import yargs from "yargs-parser";
import prompts from "prompts";
import path from "path";
import fs from "fs";

import { logger, firefly } from "./utils/logging";
import { TemplateBuilder } from "./utils/template";
import { installDependencies, intitializeGitRepository } from "./utils/dependencies";

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

    const settings = { useCurrentDirectory: false };
    const dependencies = ["@outwalk/firefly"];

    /* add the platform to dependencies if its an npm package */
    if (!["none", "custom-platform"].includes(config.platform)) {
        dependencies.push(config.platform);
    }

    /* add the database to dependencies if its an npm package */
    if (!["none", "custom-database"].includes(config.database)) {
        dependencies.push(config.database);
    }

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
        template.inject("options", (config.database != "none") ? "{ platform, database }" : "{ platform }");

        /* apply platform snippets to the template */
        if (config.platform.startsWith("custom")) {
            template.snippet("import-platform", path.join(snippetPath, config.platform, config.language, "import-platform.template"));
            template.snippet("define-platform", path.join(snippetPath, config.platform, config.language, "define-platform.template"));
        } else {
            template.snippet("import-platform", path.join(snippetPath, config.platform, "import-platform.template"));
            template.snippet("define-platform", path.join(snippetPath, config.platform, "define-platform.template"));
        }

        /* apply the database snippets to the template */
        if (config.database.startsWith("custom")) {
            template.snippet("import-database", path.join(snippetPath, config.database, config.language, "import-database.template"));
            template.snippet("define-database", path.join(snippetPath, config.database, config.language, "define-database.template"));
        } else if (config.database != "none") {
            template.snippet("import-database", path.join(snippetPath, config.database, "import-database.template"));
            template.snippet("define-database", path.join(snippetPath, config.database, "define-database.template"));
        } else {
            template.inject("import-database", "");
            template.inject("define-database", "");
        }

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