import path from "path";
import fs from "fs";

/* delete a directory */
export function deleteDirectory(directory, deleteRoot = true) {
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);
    for (let file of files) {
        const current = path.join(directory, file);
        if (fs.lstatSync(current).isDirectory()) deleteDirectory(current);
        else fs.unlinkSync(current);
    }

    if (deleteRoot) fs.rmdirSync(directory);
}

/* load and validate the package.json */
export function loadPackage() {
    const { main, engines, dependencies } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")));
    /* ensure the main field exists and is not empty */
    if (!main || !main.length) {
        throw new Error("the package.json main field is required.");
    }

    return { main, engines, dependencies };
}