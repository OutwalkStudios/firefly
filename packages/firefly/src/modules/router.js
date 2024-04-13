import express from "express";
import path from "path";
import fs from "fs";
import { toCamlCase } from "../utils/string";

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
                if (!exports[name]?._meta?.injectable) continue;

                const injectable = new exports[name]();
                injectables[toCamlCase(name)] = injectable;

                /* run the injectable init function if the injectable does not have any child injectables */
                if (typeof injectable.init == "function" && !injectable?._meta?.injected) {
                    await injectable.init();
                }
            }

        }
    }

    /* if this is the root load call, inject the nested injectables */
    if (root) {
        const nestedInjectables = Object.values(injectables).filter((injectable) => injectable?._meta?.injected != undefined);
        for (let injectable of nestedInjectables) {
            for (let inject of injectable._meta.injected) {
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
                if (!exports[name]?._meta?.controller) continue;

                const controller = new exports[name]();
                const router = express.Router();

                /* inject any injectables */
                for (let injectable of controller._meta.injected) {
                    controller[injectable.propertyKey] = injectables[injectable.injectableKey];
                }

                /* run the controller init function */
                if (typeof controller.init == "function") await controller.init();

                /* register any http routes */
                for (let route of controller._meta.routes) {
                    router[route.method](route.route, async (req, res, next) => {
                        try {
                            const result = await route.handler.call(controller, req, res);
                            const status = (route.method == "get") ? 200 : 201;
                            const data = (typeof result === "object") ? JSON.stringify(result) : result;

                            res.status(status).send(data);
                        } catch (error) {
                            next(error);
                        }
                    });
                }

                controllers[exports[name]._meta.route ?? currentDirectory.split(rootDirectory).at(-1)] = router;
            }
        }
    }

    return controllers;
}