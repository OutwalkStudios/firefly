import { Platform } from "./platform";
import express from "express";

export class ExpressPlatform extends Platform {

    constructor() {
        super();

        this.app = express();

        this.app.disable("x-powered-by");
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    use(...middleware) { this.app.use(...middleware); }
    listen(port) { this.app.listen(port); }

    loadController(route, middleware, routes) {
        const router = express.Router({ mergeParams: true });
        if (middleware.length > 0) router.use(...middleware);

        for (let route of routes) {

            router[route.method](route.route, ...route.middleware, async (req, res, next) => {
                try {
                    const result = await route.handler(req, res, next);
                    if (result == undefined || result == null) return res.end();

                    const status = (route.method == "post") ? 201 : 200;
                    const method = (typeof result === "object") ? "json" : "send";

                    res.status(status)[method](result);
                } catch (error) {
                    next(error);
                }
            });
        }

        this.app.use(route, router);
    }

    loadErrorHandler() {
        // eslint-disable-next-line no-unused-vars
        this.app.use((error, req, res, next) => {
            const statusCode = error.statusCode ?? 500;
            const message = error.message ?? "Something went wrong.";
            const metadata = error.metadata ?? {};

            return res.status(statusCode).json({ statusCode, message, ...metadata });
        });
    };
}