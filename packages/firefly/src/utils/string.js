export function toPascalCase(string) {
    return string.replace(/(?:^\w|\b\w)/g, (match) => match.toUpperCase());
}