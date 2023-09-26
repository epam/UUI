import { TTypeProp, typeRefToUniqueString } from './types';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import { uuiRoot } from '../utils/constants';

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

export class SimpleIdGen {
    private _id = 0;

    getNextId = () => {
        return String(++this._id);
    };
}

export class PropsSet {
    private _propsMap = new Map<string, TTypeProp>();

    add(p: TTypeProp) {
        const id = PropsSet.buildId(p);
        this._propsMap.set(id, p);
    }

    addAll(pa: TTypeProp[]) {
        pa.forEach((p) => {
            const id = PropsSet.buildId(p);
            this._propsMap.set(id, p);
        });
    }

    has(p: TTypeProp): boolean {
        const id = PropsSet.buildId(p);
        return this._propsMap.has(id);
    }

    toArray(): TTypeProp[] {
        return [...this._propsMap.values()];
    }

    static concat(psa: PropsSet[]): TTypeProp[] {
        const tempPs = psa.reduce<PropsSet>((acc, ps) => {
            acc.addAll(ps.toArray());
            return acc;
        }, new PropsSet());
        return tempPs.toArray();
    }

    static fromArray(pa: TTypeProp[]): PropsSet {
        const ps = new PropsSet();
        pa.forEach((p) => {
            ps.add(p);
        });
        return ps;
    }

    static buildId(p: TTypeProp) {
        // we don't use uniqueId property because we need to eliminate duplicates which come from same type (it's possible in union types)
        return `${typeRefToUniqueString(p.from)}:${p.name}:${p.typeValue.raw.replace(/[\n\s]/g, '')}`;
    }
}
