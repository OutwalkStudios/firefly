export function toCamlCase(string) {
    return string.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        return (+match === 0) ? "" : index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
}