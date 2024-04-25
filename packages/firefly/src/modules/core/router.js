import path from "path";
import fs from "fs";

/* load and return the injectables */
export async function loadInjectables(directory, root = true) {
    const injectables = {};

    const routes = fs.readdirSync(directory);
    for (let route of routes) {
        const stat = fs.statSync(path.join(directory, route));

        if (stat.isDirectory()) {
            const resolved = await loadInjectables(path.join(directory, route), false);
            Object.assign(injectables, resolved);
        }

        else if (stat.isFile() && route.endsWith(".service.js")) {
            const exports = await import(path.join(path.relative(__dirname, directory), route));

            for (let name of Object.keys(exports)) {
                if (!exports[name]?._injectable) continue;

                const injectable = new exports[name]();
                injectables[name] = injectable;

                /* run the injectable init function if the injectable does not have any child injectables */
                if (typeof injectable.init == "function" && !injectable?._injected) {
                    await injectable.init();
                }
            }

        }
    }

    /* if this is the root load call, inject the nested injectables */
    if (root) {
        const nestedInjectables = Object.values(injectables).filter((injectable) => injectable?._injected);
        for (let injectable of nestedInjectables) {
            for (let inject of injectable._injected) {
                injectable[inject.propertyKey] = injectables[inject.injectableKey];
            }

            if (typeof injectable.init == "function") await injectable.init();
        }
    }

    return injectables;
}

/* load and return the controllers */
export async function loadControllers(rootDirectory, currentDirectory, injectables) {
    const controllers = {};

    const routes = fs.readdirSync(currentDirectory);
    for (let route of routes) {
        const stat = fs.statSync(path.join(currentDirectory, route));

        if (stat.isDirectory()) {
            const resolved = await loadControllers(rootDirectory, path.join(currentDirectory, route), injectables);
            Object.assign(controllers, resolved);
        }

        else if (stat.isFile() && route.endsWith(".controller.js")) {
            const exports = await import(path.join(path.relative(__dirname, currentDirectory), route));

            for (let name of Object.keys(exports)) {
                if (!exports[name]?._controller) continue;

                const controller = new exports[name]();
                const middleware = (exports[name]?._middleware?.class) || [];

                /* inject any injectables */
                for (let injectable of controller._injected ?? []) {
                    controller[injectable.propertyKey] = injectables[injectable.injectableKey];
                }

                /* run the controller init function */
                if (typeof controller.init == "function") await controller.init();

                /* assign the middleware and bind the context to the controller */
                for (let route of controller._routes) {
                    route.middleware = controller._middleware?.[route.handler.name] ?? [];
                    route.handler = route.handler.bind(controller);
                }

                const fileRoute = currentDirectory.split(rootDirectory).at(-1);
                const endpoint = exports[name]._route ?? fileRoute.length > 0 ? fileRoute : "/";

                controllers[endpoint] = { middleware: middleware, routes: controller._routes };
            }
        }
    }

    return controllers;
}