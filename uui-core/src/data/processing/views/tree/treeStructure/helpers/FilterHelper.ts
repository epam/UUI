import { TreeStructure } from '../TreeStructure';
import { ApplyFilterToTreeSnapshotOptions, FilterOptions } from './types';

export class FilterHelper {
    public static filter<TItem, TId, TFilter>({ treeStructure, getFilter, filter }: FilterOptions<TItem, TId, TFilter>): TreeStructure<TItem, TId> {
        const isMatchingFilter = getFilter?.(filter);
        return this.applyFilterToTreeSnapshot({ treeStructure, filter: isMatchingFilter });
    }

    private static applyFilterToTreeSnapshot<TItem, TId>({ treeStructure, filter }: ApplyFilterToTreeSnapshotOptions<TItem, TId>) {
        if (!filter) return treeStructure;

        const matchedItems: TItem[] = [];
        const applyFilterRec = (items: TItem[]) => {
            let isSomeMatching: number | boolean = false;
            items.forEach((item) => {
                const isItemMatching = filter(item);
                const id = treeStructure.getParams().getId(item);
                const isSomeChildMatching = applyFilterRec(treeStructure.getChildren(id));
                const isMatching = isItemMatching || isSomeChildMatching;
                if (isMatching) {
                    matchedItems.push(item);
                }

                if (!isSomeMatching) {
                    isSomeMatching = isMatching;
                }
            });

            return isSomeMatching;
        };

        applyFilterRec(treeStructure.getRootItems());

        return TreeStructure.createFromItems({
            itemsAccessor: treeStructure.itemsAccessor,
            params: treeStructure.getParams(),
            items: matchedItems,
        });
    }
}
