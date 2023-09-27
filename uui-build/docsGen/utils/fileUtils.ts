import fs from 'fs';
import path from 'path';
import { uuiRoot } from '../constants';
import { INCLUDED_UUI_PACKAGES } from '../constants';

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

export function getUuiModuleNameFromPath(absolutePath: string) {
    const rel = path.relative(uuiRoot, absolutePath);
    const moduleFolderName = rel.split(path.sep)[0];
    const foundEntry = Object.entries(INCLUDED_UUI_PACKAGES).find((e) => {
        const folderName = e[1];
        return folderName === moduleFolderName;
    });
    if (foundEntry) {
        return foundEntry[0];
    }
    return rel.replace(/\\/g, '/');
}
