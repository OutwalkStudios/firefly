import path from "path";
import fs from "fs";

/* a decorator to apply the constructor behavior to a method */
export function Init() {
    return (target, key) => {
        if (target._initMethod != undefined) {
            throw new Error("A class can only define one constructor method with @Init()");
        }

        target._initMethod = key;
    };
}

/* load and return the injectables */
export async function loadInjectables(directory, root = true) {
    const injectables = {};

    const routes = fs.readdirSync(directory);
    for (let route of routes) {
        const stat = fs.statSync(path.join(directory, route));

        if (stat.isDirectory()) {
            const resolved = await loadInjectables(path.join(directory, route), false);

            /* merge the injectable objects while checking for duplicates */
            Object.keys(resolved).forEach((key) => {
                if (injectables[key]) {
                    throw new Error(`Injectable "${key}" already exists and must be unique.`);
                }

                injectables[key] = resolved[key];
            });
        }

        else if (stat.isFile() && route.endsWith(".service.js")) {
            const exports = await import(path.join(path.relative(__dirname, directory), route));

            for (let name of Object.keys(exports)) {
                if (!exports[name]?._injectable) continue;

                const injectable = new exports[name]();
                injectables[name] = injectable;

                /* run the injectable init function if the injectable does not have any child injectables */
                if (injectable._initMethod && !injectable?._injected) {
                    await injectable[injectable._initMethod]();
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

            if (injectable._initMethod) await injectable[injectable._initMethod]();
        }
    }

    return injectables;
}

/* load and return the controllers */
export async function loadControllers(root, directory, injectables) {
    const controllers = {};

    const routes = fs.readdirSync(directory);
    for (let route of routes) {
        const stat = fs.statSync(path.join(directory, route));

        if (stat.isDirectory()) {
            const resolved = await loadControllers(root, path.join(directory, route), injectables);
            /* merge the controller objects while checking for duplicates */
            Object.keys(resolved).forEach((key) => {
                if (controllers[key]) {
                    throw new Error(`Controller "${controllers[key].name}" uses the route "${key}" which already exists.`);
                }

                controllers[key] = resolved[key];
            });
        }

        else if (stat.isFile() && route.endsWith(".controller.js")) {
            const exports = await import(path.join(path.relative(__dirname, directory), route));

            for (let name of Object.keys(exports)) {
                if (!exports[name]?._controller) continue;

                const controller = new exports[name]();
                const middleware = exports[name]?._middleware?.class || [];

                /* inject any injectables */
                for (let injectable of (controller._injected ?? [])) {
                    controller[injectable.propertyKey] = injectables[injectable.injectableKey];
                }

                /* run the controller init function */
                if (controller._initMethod) await controller[controller._initMethod]();

                /* assign the middleware and bind the context to the controller */
                for (let route of (controller._routes ?? [])) {
                    route.middleware = controller._middleware?.[route.handler.name] ?? [];
                    route.handler = route.handler.bind(controller);
                }

                const fileRoute = directory.split(root).at(-1);
                const endpoint = exports[name]._route ?? (fileRoute.length > 0 ? fileRoute : "/");

                controllers[endpoint] = { name: name, middleware: middleware, routes: controller._routes ?? [] };
            }
        }
    }

    return controllers;
}