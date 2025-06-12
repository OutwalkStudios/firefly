import { EventEmitter } from "./modules/events";
import { loadInjectables, loadControllers, loadEventListeners } from "./modules/core/router";
import { loadPackage } from "./utils/files";
import { logger } from "./utils/logging";

export class Application {

    static injectables = {};

    constructor(options = {}) {
        this.platform = options.platform;
        this.database = options.database;

        /* make sure we dont log the startup message on each reload when in dev mode */
        this.logging = !process.env.FIREFLY_DISABLE_LOGGING;
    }

    /* resolve an injectable outside the normal lifecycle */
    static resolveInjectable(injectable) {
        return Application.injectables[(typeof injectable == "function") ? injectable.name : injectable];
    }

    /* start the application */
    async listen(port = process.env.PORT ?? 8080) {
        try {
            /* determine the location to load routes from */
            const { main } = loadPackage();
            const root = main.split("/")[0];

            /* if a database object is provided and not yet connected, start the connection */
            if (this.database && !this.database.isConnected()) {
                await this.database.connect();
            }

            /* load the injectables and controllers from the filesystem */
            Application.injectables = await loadInjectables(root, { "EventEmitter": new EventEmitter() });
            const controllers = await loadControllers(root, root, Application.injectables);

            /* load and attach the event listeners from the file system */
            await loadEventListeners(root, root, Application.injectables);

            Object.entries(controllers).forEach(([route, { middleware, routes }]) => {
                this.platform.loadController(route, middleware, routes);
            });

            /* setup the platform error handling */
            this.platform.loadErrorHandler();

            /* start the web server */
            this.platform.listen(port);
            if (this.logging) logger.log(`running on http://localhost:${port}`);
        } catch (error) {
            logger.error(error.message);
        }
    }
}

export * from "./modules/core/controller";
export * from "./modules/core/injectable";
export * from "./modules/platform/platform";
export * from "./modules/database/database";

export { Init } from "./modules/core/router";