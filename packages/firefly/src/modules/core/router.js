import { Module } from "../../utils/files";
import { Platform } from "../platform/platform";
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

/* load and return the application */
export async function loadApplication(Application, injectables = {}) {
    const application = new Application();

    /* inject any injectables */
    for (let injectable of (application._injected ?? [])) {
        application[injectable.propertyKey] = injectables[injectable.injectableKey];

        /* throw an error if a platform is incorrectly injected */
        if (application[injectable.propertyKey] instanceof Platform && injectable.propertyKey != "platform") {
            throw new Error(`Injectable "${application[injectable.propertyKey].constructor.name}" must be defined as "platform".`);
        }        
    }

    /* attach the events to the event emitter and bind the context to the event listener */
    for (let event of (application._events ?? [])) {
        injectables["EventEmitter"].on(event.name, event.handler.bind(application));
    }

    /* run the controller init function */
    if (application._initMethod) await application[application._initMethod]();

    return application;
}

/* load and return the injectables */
export async function loadInjectables(directory, injectables = {}, root = true) {
    const routes = fs.readdirSync(directory);

    for (let route of routes) {
        const stat = fs.statSync(path.join(directory, route));

        /* recursively scan the directory for injectables */
        if (stat.isDirectory()) await loadInjectables(path.join(directory, route), injectables, false);

        /* load the injectables defined in the current file */
        if (stat.isFile() && route.endsWith(".service.js")) {
            const exports = await import(path.join(path.relative(Module.__dirname(import.meta.url), directory), route));

            for (let name of Object.keys(exports)) {
                if (!exports[name]?._injectable) continue;

                if (injectables[name]) throw new Error(`Injectable "${name}" already exists and must be unique.`);

                const injectable = new exports[name]();
                injectables[name] = injectable;
            }
        }
    }

    /* if this is the root load call, inject the nested injectables and events */
    if (root) {
        for (const injectable of Object.values(injectables)) {

            /* inject any injectables */
            for (const inject of (injectable._injected ?? [])) {
                injectable[inject.propertyKey] = injectables[inject.injectableKey];
            }

            /* attach the events to the event emitter and bind the context to the event listener */
            for (let event of (injectable._events ?? [])) {
                injectables["EventEmitter"].on(event.name, event.handler.bind(injectable));
            }

            /* run the injectable init function */
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
                const validation = exports[name]?._validation?.class || [];

                /* inject any injectables */
                for (let injectable of (controller._injected ?? [])) {
                    controller[injectable.propertyKey] = injectables[injectable.injectableKey];
                }

                /* attach the events to the event emitter and bind the context to the event listener */
                for (let event of (controller._events ?? [])) {
                    injectables["EventEmitter"].on(event.name, event.handler.bind(controller));
                }

                /* run the controller init function */
                if (controller._initMethod) await controller[controller._initMethod]();

                /* assign the middleware and bind the context to the controller */
                for (let route of (controller._routes ?? [])) {
                    route.middleware = controller._middleware?.[route.handler.name] ?? [];
                    route.validation = controller._validation?.[route.handler.name] ?? [];
                    route.handler = route.handler.bind(controller);
                }

                const fileRoute = directory.split(root).at(-1);
                const fileEndpoint = fileRoute.length > 0 ? fileRoute : "/";
                const endpoint = (exports[name]._route) ? fileEndpoint.replace(/\/[^/]+\/?$/, exports[name]._route) : fileEndpoint;

                if (controllers[endpoint]) {
                    throw new Error(`Controller "${name}" uses the route "${endpoint}" which already exists.`);
                }

                controllers[endpoint] = { middleware: middleware, validation: validation, routes: controller._routes ?? [] };
            }
        }
    }

    return controllers;
}