/* create an http decorator function */
function createHttpDecorator(method, route = "/") {
    return (target, key) => {
        target._routes = target._routes ?? [];
        target._routes.push({ method: method.toLowerCase(), route: route, handler: target[key] });
    };
}

/* a decorator to apply the controller metadata to a class */
export function Controller(route) {
    return (target) => {
        target._controller = true;
        target._route = route;
    };
}

/* a decorator to apply middleware to a controller or route */
export function Middleware(...args) {
    return (target, key = "class") => { (target._middleware ??= {})[key] = args; };
}

/* a decorator to validate incoming request data */
export function Validate(schema, property = "body") {
    return (target, key = "class") => { ((target._validation ??= {})[key] ??= []).push({ schema, property }); };
}

export const Http = createHttpDecorator;
export const Head = createHttpDecorator.bind(null, "HEAD");
export const Get = createHttpDecorator.bind(null, "GET");
export const Post = createHttpDecorator.bind(null, "POST");
export const Put = createHttpDecorator.bind(null, "PUT");
export const Patch = createHttpDecorator.bind(null, "PATCH");
export const Delete = createHttpDecorator.bind(null, "DELETE");