import { loadInjectables, loadControllers } from "./modules/router";
import express from "express";
import path from "path";

export class Application {

    app = express();

    constructor(options = {}) {
        this.database = options.database;
        this.port = options.port ?? (process.env.PORT ?? 8080);

        this.app.disable("x-powered-by");
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    use(middleware) {
        this.app.use(middleware);
    }

    async listen(callback) {
        if (this.database) await this.database.connect();

        const routes = path.join(process.cwd(), "dist/routes");
        const injectables = await loadInjectables(routes);
        const controllers = await loadControllers(routes, injectables);
        Object.entries(controllers).forEach(([route, router]) => this.app.use(route, router));

        this.app.use((error, req, res, next) => {
            const statusCode = error.statusCode ?? 500;
            const message = error.message ?? "Something went wrong.";

            return res.status(statusCode).json({ message });
        });

        this.app.listen(this.port, callback);
    }
}


export * from "./modules/controller";
export * from "./modules/injectable";