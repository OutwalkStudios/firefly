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

    use(middleware) { this.app.use(middleware); }
    listen(port) { this.app.listen(port); }

    loadController(route, routes) {
        const router = express.Router();

        for (let route of routes) {
            router[route.method](route.route, async (req, res, next) => {
                try {
                    const result = await route.handler(req, res);
                    if (result == undefined) return;

                    const status = (route.method == "get") ? 200 : 201;
                    const data = (typeof result === "object") ? JSON.stringify(result) : result;

                    res.status(status).send(data);
                } catch (error) {
                    next(error);
                }
            });
        }

        this.app.use(route, router);
    }

    loadErrorHandler() {
        this.app.use((error, req, res, next) => {
            const statusCode = error.statusCode ?? 500;
            const message = error.message ?? "Something went wrong.";

            return res.status(statusCode).json({ message });
        });
    };
}