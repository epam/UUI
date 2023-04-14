const fs = require('fs');
const path = require('path');

module.exports = { createFileSync, readJsonFileSync };

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
        fs.rmSync(filePathResolved)
    }
    const targetDir = path.dirname(filePathResolved);
    !fs.existsSync(targetDir) && fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(filePathResolved, contentStr)
}

function readJsonFileSync(filePathResolved) {
    const content = fs.readFileSync(filePathResolved, 'utf8').toString();
    return JSON.parse(content);
}
