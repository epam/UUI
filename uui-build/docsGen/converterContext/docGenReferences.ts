import { IDocGenReferences, typeRefToUniqueString } from '../types/types';
import { TPublicTypesByModule, TTypeRef, TTypeRefMap, TTypeRefShort } from '../types/docsGenSharedTypes';

export class DocGenReferences implements IDocGenReferences {
    private refs: TTypeRefMap = {};

    set(ref: TTypeRef) {
        const key: TTypeRefShort = typeRefToUniqueString(ref);
        this.refs[key] = ref;
        return key;
    }

    get(byModule: TPublicTypesByModule) {
        const set = Object.keys(byModule).reduce<Set<TTypeRefShort>>((acc, byExportKey) => {
            const byExport = byModule[byExportKey];
            Object.keys(byExport).forEach((exportName) => {
                const shortRef = byExport[exportName].typeRef;
                acc.add(shortRef);
            });
            return acc;
        }, new Set());
        // sort refs alphabetically
        const sortedKeys = Object.keys(this.refs).sort() as TTypeRefShort[];
        return sortedKeys.reduce<TTypeRefMap>((acc, typeRefShort) => {
            const ref = this.refs[typeRefShort];
            if (set.has(typeRefShort)) {
                ref.isPublic = true;
            }
            acc[typeRefShort] = ref;
            return acc;
        }, {});
    }
}
