import { Platform } from "./platform";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import { serve } from "@hono/node-server";

export class HonoPlatform extends Platform {

    constructor(options = { logErrors: false }) {
        super();

        this.options = options;
        this.app = new Hono();
        this.factory = createFactory();
    }

    use(...args) { this.app.use(...args); }
    listen(port) { serve({ fetch: this.app.fetch, port: port }); }

    loadController(route, middleware, routes) {
        const router = this.factory.createApp();

        if (middleware.length > 0) router.use(...middleware);

        for (let route of routes) {
            router.on(route.method.toUpperCase(), route.route, ...route.middleware, async (ctx, next) => {
                try {
                    const result = await route.handler(ctx, next);
                    if (result instanceof Response) return result;
                    if (result == undefined || result == null) return ctx.body(null, 200);

                    const status = (route.method == "post") ? 201 : 200;
                    const method = (typeof result === "object") ? "json" : "body";

                    return ctx[method](result, status);
                } catch (error) {
                    next(error);
                }
            });
        }

        this.app.route(route, router);
    }

    loadErrorHandler() {
        this.app.onError((error, ctx) => {
            const statusCode = error.statusCode ?? 500;
            const message = error.message ?? "Something went wrong.";
            const metadata = error.metadata ?? {};

            if (this.options.logErrors || error.statusCode == undefined) console.error(error);

            return ctx.json({ statusCode, message, ...metadata }, statusCode);
        });
    };
}