import { IDocGenReferences, typeRefToUniqueString } from '../types/types';
import { TTypeRef, TTypeRefMap, TTypeRefShort } from '../types/docsGenSharedTypes';

export class DocGenReferences implements IDocGenReferences {
    private references: TTypeRefMap = {};

    set(ref: TTypeRef) {
        const key: TTypeRefShort = typeRefToUniqueString(ref);
        this.references[key] = ref;
        return key;
    }

    get() {
        const sortedKeys = Object.keys(this.references).sort() as TTypeRefShort[];
        return sortedKeys.reduce<TTypeRefMap>((acc, name) => {
            acc[name] = this.references[name];
            return acc;
        }, {});
    }
}
