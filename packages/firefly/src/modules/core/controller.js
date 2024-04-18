/* create an http decorator function */
function createHttpDecorator(method, route = "/") {
    return (target, key) => {
        target._meta = target._meta ?? { injected: [], routes: [] };
        target._meta.routes.push({ method, route, handler: target[key] });
    }
}

/* a decorator to apply the controller metadata to a class */
export function Controller(route) {
    return (target) => { target._meta = { controller: true, route } };
}

export const Http = createHttpDecorator;
export const Head = createHttpDecorator.bind(null, "head");
export const Get = createHttpDecorator.bind(null, "get");
export const Post = createHttpDecorator.bind(null, "post");
export const Put = createHttpDecorator.bind(null, "put");
export const Patch = createHttpDecorator.bind(null, "patch");
export const Delete = createHttpDecorator.bind(null, "delete");