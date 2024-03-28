import { IImmutableMap, IMap } from '../../../../types';
import { cloneMap, newMap } from './newTree';

export interface PatchOrderingMapParams {
    complexIds?: boolean;
}

export const PatchOrdering = {
    TOP: Symbol('ORDERING_TOP'),
    BOTTOM: Symbol('ORDERING_BOTTOM'),
    INITIAL: Symbol('ORDERING_INITIAL'),
    BY_SORTING: Symbol('ORDERING_BY_SORTING'),
    INDEX: Symbol('ORDERING_INDEX'),
};

export type PatchOrderingType =
| typeof PatchOrdering.TOP
| typeof PatchOrdering.BOTTOM
| typeof PatchOrdering.INITIAL
| typeof PatchOrdering.BY_SORTING
| [typeof PatchOrdering.INDEX, number];

export class PatchOrderingMap<TId> implements IImmutableMap<TId, PatchOrderingType> {
    private ordering: IMap<TId, PatchOrderingType>;
    private params: PatchOrderingMapParams;

    constructor(patchOrderingMap: PatchOrderingMap<TId>);
    constructor(params: PatchOrderingMapParams, ordering: IMap<TId, PatchOrderingType> | undefined);

    constructor(...args: [PatchOrderingMap<TId>] | [PatchOrderingMapParams, IMap<TId, PatchOrderingType> | undefined]) {
        if (args[0] instanceof PatchOrderingMap) {
            const [patchOrderingMap] = args;
            this.ordering = cloneMap(patchOrderingMap.ordering);
        } else {
            const [params, ordering] = args;
            this.params = params;
            this.ordering = ordering ? cloneMap(ordering) : newMap(this.params);
        }
    }

    get(id: TId) {
        return this.ordering.get(id);
    }

    set(id: TId, patchOrdering?: PatchOrderingType): IImmutableMap<TId, PatchOrderingType> {
        const newOrdering = cloneMap(this.ordering);
        newOrdering.set(id, patchOrdering);
        return new PatchOrderingMap(this.params, newOrdering);
    }

    delete(id: TId): IImmutableMap<TId, any> {
        const newOrdering = cloneMap(this.ordering);
        newOrdering.delete(id);
        return new PatchOrderingMap(this.params, newOrdering);
    }

    has(id: TId): boolean {
        return this.ordering.has(id);
    }

    allToSorting() {
        const newOrdering = cloneMap(this.ordering);
        for (const [id] of newOrdering) {
            newOrdering.set(id, PatchOrdering.BY_SORTING);
        }
        return new PatchOrderingMap(this.params, newOrdering);
    }

    size: number;
    [Symbol.iterator](): IterableIterator<[TId, any]> {
        return this.ordering[Symbol.iterator]();
    }

    public static blank<TId>(
        params: PatchOrderingMapParams = {},
    ) {
        return new PatchOrderingMap<TId>(params, newMap(params));
    }
}
