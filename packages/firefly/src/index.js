import { loadInjectables, loadControllers } from "./modules/core/router";
import { loadPackage } from "./utils/files";
import { logger } from "./utils/logging";

export class Application {

    constructor(options = {}) {
        this.platform = options.platform;
        this.database = options.database;
    }

    async listen(port = process.env.PORT ?? 8080) {
        try {
            /* determine the location to load routes from */
            const { main } = loadPackage();
            const root = main.split("/")[0];

            /* if a database driver is provided, run the connect method */
            if (this.database) {
                logger.log("connecting to database...");
                await this.database.connect();
            }

            /* load the injectables and controllers from the filesystem */
            const injectables = await loadInjectables(root);
            const controllers = await loadControllers(root, root, injectables);

            Object.entries(controllers).forEach(([route, { middleware, routes }]) => {
                this.platform.loadController(route, middleware, routes);
            });

            /* setup the platform error handling */
            this.platform.loadErrorHandler();

            /* start the web server */
            this.platform.listen(port);
            logger.log(`running on http://localhost:${port}`);
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