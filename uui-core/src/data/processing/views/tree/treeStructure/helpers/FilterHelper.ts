import { NOT_FOUND_RECORD } from '../../constants';
import { ITree } from '../../ITree';
import { TreeStructure } from '../TreeStructure';
import { ApplyFilterToTreeSnapshotOptions, FilterOptions } from './types';

export class FilterHelper {
    public static filter<TItem, TId, TFilter>({
        tree,
        getFilter,
        filter,
        newTreeInstance = (options) => TreeStructure.createFromItems(options),
    }: FilterOptions<TItem, TId, TFilter>): ITree<TItem, TId> {
        const isMatchingFilter = getFilter?.(filter);
        return this.applyFilterToTreeSnapshot({ tree, newTreeInstance, filter: isMatchingFilter });
    }

    private static applyFilterToTreeSnapshot<TItem, TId>({
        tree,
        filter,
        newTreeInstance,
    }: ApplyFilterToTreeSnapshotOptions<TItem, TId>) {
        if (!filter) return tree;

        const matchedItems: TItem[] = [];
        const applyFilterRec = (ids: TId[]) => {
            let isSomeMatching: number | boolean = false;
            ids.forEach((id) => {
                const item = tree.getById(id);
                if (item === NOT_FOUND_RECORD) return;

                const isItemMatching = filter(item);
                const { ids: children } = tree.getItems(id);
                const isSomeChildMatching = applyFilterRec(children);
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

        const { ids: root } = tree.getItems(undefined);
        applyFilterRec(root);

        return newTreeInstance({
            itemsAccessor: tree.getItemsAccessor(),
            params: tree.getParams(),
            items: matchedItems,
        });
    }
}
