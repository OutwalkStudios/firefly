/* convert a string to pascal case */
export function toPascalCase(string) {
    return string.replace(/(?:^\w|\b\w)/g, (match) => match.toUpperCase());
}