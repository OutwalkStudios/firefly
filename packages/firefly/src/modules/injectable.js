import { toPascalCase } from "../utils/string";

/* a decorator to apply the injectable metadata to a class */
export function Injectable() {
    return (target) => { target._meta = { injectable: true, name: target.name } };
}

/* a decorator to apply metadata for dependency injection on a class property */
export function Inject(injectable) {
    const injectableKey = (typeof injectable == "function") ? injectable.name : injectable;
    
    return (target, key) => {
        target._meta = target._meta ?? { injected: [], routes: [] };
        target._meta.injected.push({ propertyKey: key, injectableKey: injectableKey ?? toPascalCase(key) });
    };
}