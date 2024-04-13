import { loadInjectables, loadControllers } from "./modules/router";
import express from "express";
import path from "path";

export class Application {


    constructor(options = {}) {
        this.routes = options.routes ?? path.join(process.cwd(), "dist/routes");
        this.database = options.database;
        this.port = options.port ?? (process.env.PORT ?? 8080);

        this.app = express();

        this.app.disable("x-powered-by");
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    /* connect a middleware function to the application */
    use(middleware) {
        this.app.use(middleware);
    }

    async listen() {
        /* if a database driver is provided, run the connect method */
        if (this.database) await this.database.connect();

        /* load the injectables and controllers from the filesystem */
        const injectables = await loadInjectables(this.routes);
        const controllers = await loadControllers(this.routes, this.routes, injectables);
        Object.entries(controllers).forEach(([route, router]) => this.app.use(route, router));

        /* setup default error handling */
        this.app.use((error, req, res, next) => {
            const statusCode = error.statusCode ?? 500;
            const message = error.message ?? "Something went wrong.";

            return res.status(statusCode).json({ message });
        });

        /* start the web server */
        this.app.listen(this.port);
    }
}


export * from "./modules/controller";
export * from "./modules/injectable";