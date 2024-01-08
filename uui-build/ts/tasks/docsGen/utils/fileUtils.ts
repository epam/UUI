import fs from 'fs';
import path from 'path';
import { uuiRoot } from '../../../constants';

export function getUuiVersion() {
    const str = fs.readFileSync(path.resolve(uuiRoot, 'lerna.json')).toString();
    return JSON.parse(str).version;
}

export function makeRelativeToUuiRoot(fullPath: string) {
    return removeTrailingDots(path.relative(uuiRoot, fullPath).replace(/\\/g, '/'));
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
    return mapModuleName(rel);
}
function removeTrailingDots(rel: string) {
    /**
     * Converts this: '../../../../node_modules/typescript/lib/lib.es5.d.ts'
     * To this: 'node_modules/typescript/lib/lib.es5.d.ts'
     */
    return rel.replace(/^((..[/])+)(.*)$/g, '$3');
}
function mapModuleName(rel: string): string {
    const map: Record<string, string> = {
        'node_modules/@types/react/index.d.ts': '@types/react',
    };
    const prefix = Object.keys(map).find((key) => rel.startsWith(key));
    if (prefix) {
        const suffix = rel.substring(prefix.length);
        return `${map[prefix]}${suffix}`;
    }
    return rel;
}
