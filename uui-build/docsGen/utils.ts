import { TTypeProp } from './types';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import { uuiRoot } from '../utils/constants';

export function makeRelativeToUuiRoot(fullPath: string) {
    return path.relative(uuiRoot, fullPath).replace(/\\/g, '/');
}

function propsComparator(p1: TTypeProp, p2: TTypeProp) {
    function compareStr(s1: string, s2: string) {
        return String(s1).localeCompare(String(s2));
    }
    return compareStr(p1.name, p2.name)
        || compareStr(`${p1.from?.module}/${p1.from?.typeName.name}`, `${p2.from?.module}/${p2.from?.typeName.name}`)
        || compareStr(String(p1.required), String(p2.required));
}

export function sortProps(propsArr: TTypeProp[]): TTypeProp[] | undefined {
    if (propsArr) {
        return [...propsArr].sort(propsComparator);
    }
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
