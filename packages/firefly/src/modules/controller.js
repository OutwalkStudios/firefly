/* define a route by applying metadata to a target */
function defineRoute(target, key, method, route) {
    target._meta = target._meta ?? { injected: [], routes: [] };
    target._meta.routes.push({ method: method, route: route, handler: target[key] });
}

/* a decorator to apply the controller metadata to a class */
export function Controller(route) {
    return (target) => { target._meta = { controller: true, route } };
}

/* a decorator to map a function to an http endpoint for a GET request */
export function Get(route = "/") {
    return (target, key) => { defineRoute(target, key, "get", route) };
}

/* a decorator to map a function to an http endpoint for a POST request */
export function Post(route = "/") {
    return (target, key) => { defineRoute(target, key, "post", route) };
}

/* a decorator to map a function to an http endpoint for a PUT request */
export function Put(route = "/") {
    return (target, key) => { defineRoute(target, key, "put", route) };
}

/* a decorator to map a function to an http endpoint for a Patch request */
export function Patch(route = "/") {
    return (target, key) => { defineRoute(target, key, "patch", route) };
}

/* a decorator to map a function to an http endpoint for a DELETE request */
export function Delete(route = "/") {
    return (target, key) => { defineRoute(target, key, "delete", route) };
}