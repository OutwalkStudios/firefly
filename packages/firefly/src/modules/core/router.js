import { Module } from "../../utils/files";
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
export async function loadInjectables(directory, injectables = {}, root = true) {
    const routes = fs.readdirSync(directory);

    for (let route of routes) {
        const stat = fs.statSync(path.join(directory, route));

        if (stat.isDirectory()) {
            await loadInjectables(path.join(directory, route), injectables, false);
        }

        else if (stat.isFile() && route.endsWith(".service.js")) {
            const exports = await import(path.join(path.relative(Module.__dirname(import.meta.url), directory), route));

            for (let name of Object.keys(exports)) {
                if (!exports[name]?._injectable) continue;

                if (injectables[name]) {
                    throw new Error(`Injectable "${name}" already exists and must be unique.`);
                }

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
export async function loadControllers(root, directory, injectables, controllers = {}) {
    const routes = fs.readdirSync(directory);

    for (let route of routes) {
        const stat = fs.statSync(path.join(directory, route));

        if (stat.isDirectory()) {
            await loadControllers(root, path.join(directory, route), injectables, controllers);
        }

        else if (stat.isFile() && route.endsWith(".controller.js")) {
            const exports = await import(path.join(path.relative(Module.__dirname(import.meta.url), directory), route));

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
                const fileEndpoint = fileRoute.length > 0 ? fileRoute : "/";
                const endpoint = (exports[name]._route) ? fileEndpoint.replace(/\/[^/]+\/?$/, exports[name]._route) : fileEndpoint;

                if (controllers[endpoint]) {
                    throw new Error(`Controller "${name}" uses the route "${endpoint}" which already exists.`);
                }

                controllers[endpoint] = { middleware: middleware, routes: controller._routes ?? [] };
            }
        }
    }

    return controllers;
}

export async function loadEventListeners(root, directory, injectables, listeners = {}) {
    const routes = fs.readdirSync(directory);

    for (let route of routes) {
        const stat = fs.statSync(path.join(directory, route));

        if (stat.isDirectory()) {
            await loadEventListeners(root, path.join(directory, route), injectables, listeners);
        }

        else if (stat.isFile() && route.endsWith(".events.js")) {
            const exports = await import(path.join(path.relative(Module.__dirname(import.meta.url), directory), route));

            for (let name of Object.keys(exports)) {
                if (!exports[name]?._listener) continue;

                const listener = new exports[name]();

                /* inject any injectables */
                for (let injectable of (listener._injected ?? [])) {
                    listener[injectable.propertyKey] = injectables[injectable.injectableKey];
                }

                /* run the event listener init function */
                if (listener._initMethod) await listener[listener._initMethod]();

                /* get the event emitter injectable instance */
                const emitter = injectables["EventEmitter"];

                /* attach the events to the event emitter and bind the context to the event listener */
                for (let event of (listener._events ?? [])) {
                    emitter.on(event.name, event.handler.bind(listener));
                }
            }
        }
    }

    return listeners;
}