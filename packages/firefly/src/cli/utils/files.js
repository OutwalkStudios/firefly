import path from "path";
import fs from "fs";

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