import { loadInjectables, loadControllers, loadApplication } from "./modules/core/router";
import { ExpressPlatform } from "./modules/platform/express";
import { loadPackage } from "./utils/files";
import { EventEmitter } from "./modules/events";
import { logger } from "./utils/logging";

/* a decorator to apply the application metadata to a class */
export function Application() {
    return (target) => { initialize(target); };
}

/* define a static injectable container */
Application.injectables = {};

/* resolve an injectable outside the normal lifecycle */
export function resolveInjectable(injectable) {
    return Application.injectables[(typeof injectable == "function") ? injectable.name : injectable];
}

/* initialize and start the application */
async function initialize(target) {
    try {
        /* determine the location to load routes from */
        const { main, dependencies } = loadPackage();
        const root = main.split("/")[0];
        const port = process.env.PORT ?? 8080;

        /* register framework injectables */
        const framework = { "EventEmitter": new EventEmitter() };
        if (Object.keys(dependencies).includes("express")) framework["Platform"] = new ExpressPlatform();

        /* load the injectables, controllers, and application from the filesystem */
        const injectables = await loadInjectables(root, framework);
        const controllers = await loadControllers(root, root, injectables);
        const application = await loadApplication(target, injectables);

        /* sync the injectables to the static container for escape hatch injections */
        Application.injectables = injectables;

        /* if a start function is defined, execute it. this must run before the platform's listen function. */
        if (typeof application.start == "function") await application.start();

        /* if a platform is configured, enable the platform dependent features */
        if (application.platform) {

            /* register the loaded controllers with the platform */
            Object.entries(controllers).forEach(([route, { middleware, validation, routes }]) => {
                application.platform.loadController(route, middleware, validation, routes);
            });

            /* setup the platform error handling and start the server */
            application.platform.loadErrorHandler();
            application.platform.listen(port);

            logger.log(`running on http://localhost:${port}`);
        }

    } catch (error) {
        logger.error(error.message);
    }
};

export * from "./modules/core/controller";
export * from "./modules/core/injectable";
export * from "./modules/platform/platform";

export { Init } from "./modules/core/router";