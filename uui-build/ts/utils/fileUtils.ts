import fs from 'fs';
import path from 'path';

/**
 * Create file at given location.
 * Overwrites existing file.
 * Creates directories if they don't exist.
 *
 * @param filePathResolved
 * @param contentStr
 */
export function createFileSync(filePathResolved: string, contentStr: string) {
    if (fs.existsSync(filePathResolved)) {
        fs.rmSync(filePathResolved);
    }
    const targetDir = path.dirname(filePathResolved);
    !fs.existsSync(targetDir) && fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(filePathResolved, contentStr);
}

export function readJsonFileSync(filePathResolved: string) {
    const content = fs.readFileSync(filePathResolved, 'utf8').toString();
    return JSON.parse(content);
}
