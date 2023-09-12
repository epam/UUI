import { TTypeProp } from './types';
import fs from 'fs';

export function sortProps(propsArr: TTypeProp[]): TTypeProp[] {
    if (!propsArr) {
        return undefined;
    }
    const arr = [...propsArr];
    arr.sort((p1, p2) => {
        return compareStr(p1.name, p2.name)
            || compareStr(`${p1.inheritedFrom.module}/${p1.inheritedFrom.name}`, `${p2.inheritedFrom.module}/${p2.inheritedFrom.name}`)
            || compareStr(p1.optional, p2.optional);
    });
    return arr;
}

function compareStr(s1?: string | boolean, s2?: string | boolean) {
    return String(s1).localeCompare(String(s2));
}

export function saveJsonToFile(fullPath: string, jsonToSave: object) {
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { force: true });
    }
    const content = JSON.stringify(jsonToSave, undefined, 1);
    fs.writeFileSync(fullPath, content);
}

export function isExternalFile(filePath: string) {
    return filePath.indexOf('node_modules') !== -1 && filePath.indexOf('@epam/') === -1;
}
