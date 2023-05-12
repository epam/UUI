const fs = require('fs');
const path = require('path');

module.exports = { createFileSync, readJsonFileSync, iterateFilesInDirAsync };

/**
 * Create file at given location.
 * Overwrites existing file.
 * Creates directories if they don't exist.
 *
 * @param filePathResolved
 * @param contentStr
 */
function createFileSync(filePathResolved, contentStr) {
    if (fs.existsSync(filePathResolved)) {
        fs.rmSync(filePathResolved);
    }
    const targetDir = path.dirname(filePathResolved);
    !fs.existsSync(targetDir) && fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(filePathResolved, contentStr);
}

function readJsonFileSync(filePathResolved) {
    const content = fs.readFileSync(filePathResolved, 'utf8').toString();
    return JSON.parse(content);
}

async function iterateFilesInDirAsync(dirPath, callback, options = {}) {
    const dir = await fs.promises.opendir(dirPath);
    for await (const entry of dir) {
        const entryPath = path.resolve(dir.path, entry.name);
        if (entry.isFile()) {
            callback(entryPath, entry);
        } else if (options.recursive) {
            await iterateFilesInDirAsync(entryPath, callback, options);
        }
    }
}
