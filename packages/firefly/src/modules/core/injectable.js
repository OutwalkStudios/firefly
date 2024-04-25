/* a decorator to apply the injectable metadata to a class */
export function Injectable() {
    return (target) => { 
        target._injectable = true;
        target._name = target.name;
    };
}

/* a decorator to apply metadata for dependency injection on a class property */
export function Inject(injectable) {
    const injectableKey = (typeof injectable == "function") ? injectable.name : injectable;
    const toPascalCase = (string) => string.replace(/(?:^\w|\b\w)/g, (match) => match.toUpperCase());

    return (target, key) => {
        target._injected = target._injected ?? [];
        target._injected.push({ propertyKey: key, injectableKey: injectableKey ?? toPascalCase(key) });
    };
}