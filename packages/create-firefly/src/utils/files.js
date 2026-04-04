import path from "path";
import url from "url";

/* module with object scope to mock the __filename and __dirname for esm */
export const Module = {
    __filename: (fileUrl) => {
        return (import.meta.url) ? url.fileURLToPath(fileUrl) : __filename;
    },
    __dirname: (fileUrl) => {
        return (import.meta.url) ? path.dirname(Module.__filename(fileUrl)) : __dirname;
    }
};