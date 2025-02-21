import { ESLint } from "eslint";
import { logger } from "../../utils/logging";

export default async function lint(args) {
    const eslint = new ESLint({ fix: args.fix });

    try {
        logger.log("linting the project...");

        const results = await eslint.lintFiles(["src/**/*.{js,ts}"]);

        if (args.fix) await ESLint.outputFixes(results);

        const formatter = await eslint.loadFormatter("stylish");
        const resultText = formatter.format(results);

        console.log(resultText);

        return { isError: (results.filter((result) => result.errorCount > 0).length > 0) };
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}