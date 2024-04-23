import { loadInjectables, loadControllers } from "./modules/core/router";
import express from "express";
import path from "path";
import fs from "fs";

export class Application {

    constructor(options = {}) {
        this.database = options.database;

        this.app = express();

        this.app.disable("x-powered-by");
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    /* connect a middleware function to the application */
    use(middleware) {
        this.app.use(middleware);
    }

    async listen(port = process.env.PORT ?? 8080) {
        /* determine the location to load routes from */
        const { main } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")));
        const root = main.split("/")[0];

        /* if a database driver is provided, run the connect method */
        if (this.database) await this.database.connect();

        /* load the injectables and controllers from the filesystem */
        const injectables = await loadInjectables(root);
        const controllers = await loadControllers(root, root, injectables);
        Object.entries(controllers).forEach(([route, router]) => this.app.use(route, router));

        /* setup default error handling */
        this.app.use((error, req, res, next) => {
            const statusCode = error.statusCode ?? 500;
            const message = error.message ?? "Something went wrong.";

            return res.status(statusCode).json({ message });
        });

        /* start the web server */
        this.app.listen(port);
    }
}


export * from "./modules/core/controller";
export * from "./modules/core/injectable";