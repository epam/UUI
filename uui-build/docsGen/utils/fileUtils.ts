import fs from 'fs';
import path from 'path';
import { uuiRoot } from '../constants';

export function makeRelativeToUuiRoot(fullPath: string) {
    return path.relative(uuiRoot, fullPath).replace(/\\/g, '/');
}

export function saveContentToFile(fullPath: string, contentToSave: object | string) {
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { force: true });
    }
    const content = typeof contentToSave === 'string' ? contentToSave : JSON.stringify(contentToSave, undefined, 1);
    fs.writeFileSync(fullPath, content);
}

export function isExternalFile(filePath: string) {
    return filePath.indexOf('node_modules') !== -1 && filePath.indexOf('@epam/') === -1;
}

export function resolveModuleName(absolutePath: string) {
    const rel = makeRelativeToUuiRoot(path.resolve(absolutePath));
    const firstDir = rel.split('/')[0];
    const pkg = path.resolve(uuiRoot, `${firstDir}/package.json`);
    if (fs.existsSync(pkg)) {
        return JSON.parse(fs.readFileSync(pkg).toString()).name;
    }
    return rel;
}
