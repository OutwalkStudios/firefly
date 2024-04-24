/* create an http decorator function */
function createHttpDecorator(method, route = "/") {
    return (target, key) => {
        target._meta = target._meta ?? { injected: [], routes: [] };
        target._meta.routes.push({ method: method.toLowerCase(), route, handler: target[key] });
    }
}

/* a decorator to apply the controller metadata to a class */
export function Controller(route) {
    return (target) => { target._meta = { controller: true, route } };
}

export const Http = createHttpDecorator;
export const Head = createHttpDecorator.bind(null, "HEAD");
export const Get = createHttpDecorator.bind(null, "GET");
export const Post = createHttpDecorator.bind(null, "POST");
export const Put = createHttpDecorator.bind(null, "PUT");
export const Patch = createHttpDecorator.bind(null, "PATCH");
export const Delete = createHttpDecorator.bind(null, "DELETE");