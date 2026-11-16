import { Platform } from "./platform";
import express from "express";

export class ExpressPlatform extends Platform {

    constructor(options = { logErrors: false }) {
        super();

        this.options = options;
        this.app = express();

        /* this function adds a rawBody property to the request object */
        const rawBodyBuffer = (req, res, buffer, encoding) => {
            if (!buffer || !buffer.length) return;
            req.rawBody = buffer.toString(encoding || "utf8");
        };

        this.app.disable("x-powered-by");
        this.app.use(express.urlencoded({ verify: rawBodyBuffer, extended: true }));
        this.app.use(express.json({ verify: rawBodyBuffer }));
    }

    use(...args) { this.app.use(...args); }
    set(...args) { this.app.set(...args); }
    listen(port) { this.app.listen(port); }

    /* define a validation middleware so that validation can happen before other middleware */
    _validation(route) {
        return async (req, res, next) => {
            try {
                for (const { schema, property } of route.validation) {
                    req[property] = await super.validate(schema, req[property]);
                }

                next();
            } catch (error) {
                next(error);
            }
        };
    }

    loadController(route, middleware, validation, routes) {
        const router = express.Router({ mergeParams: true });

        /* process any controller level validation */
        for (const { schema, property } of validation) {
            router.use(async (req, res, next) => {
                try {
                    req[property] = await super.validate(schema, req[property]);
                    next();
                } catch (error) {
                    next(error);
                }
            });
        }

        if (middleware.length > 0) router.use(...middleware);

        for (let route of routes) {
            router[route.method](route.route, this._validation(route), ...route.middleware, async (req, res, next) => {
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

            if (this.options.logErrors || error.statusCode == undefined) console.error(error);

            return res.status(statusCode).json({ statusCode, message, ...metadata });
        });
    };
}