import { loadInjectables, loadControllers } from "./modules/core/router";
import path from "path";
import fs from "fs";

export class Application {

    constructor(options = {}) {
        this.platform = options.platform;
        this.database = options.database;
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

        Object.entries(controllers).forEach(([route, { middleware, routes }]) => {
            this.platform.loadController(route, middleware, routes);
        });

        /* setup the platform error handling */
        this.platform.loadErrorHandler();

        /* start the web server */
        this.platform.listen(port);
    }
}


export * from "./modules/core/controller";
export * from "./modules/core/injectable";
export * from "./modules/platform/platform";
export * from "./modules/database/database";