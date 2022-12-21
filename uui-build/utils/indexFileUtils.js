const fs = require("fs-extra");
const path = require("path");

module.exports = { getIndexFilePath };


const indexFileNames = ["index.ts", "index.tsx"];
/**
 * Returns absolute path to "index" file if it exists.
 * @param moduleRootDir
 */
async function getIndexFilePath(moduleRootDir) {
    const found = await Promise.all(
        indexFileNames.map(async (name) => {
            const pathResolved = path.resolve(moduleRootDir, `./${name}`)
            if (await fs.exists(pathResolved)) {
                return pathResolved;
            }
        })
    );
    return found.find(Boolean);
}


