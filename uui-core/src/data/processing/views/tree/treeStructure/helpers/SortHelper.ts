import { buildSorter } from '../../helpers';
import { TreeStructure } from '../TreeStructure';
import type { SortOptions } from './types';

export class SortHelper {
    public static sort<TItem, TId, TFilter>({ treeStructure, ...options }: SortOptions<TItem, TId, TFilter>) {
        const sort = buildSorter(options);
        const sortedItems: TItem[][] = [];
        const sortRec = (items: TItem[]) => {
            sortedItems.push(sort(items));
            items.forEach((item) => {
                const id = treeStructure.getParams().getId(item);
                const children = treeStructure.getChildren(id);
                sortRec(children);
            });
        };

        sortRec(treeStructure.getRootItems());
        return TreeStructure.createFromItems({
            params: treeStructure.getParams(),
            itemsAccessor: treeStructure.itemsAccessor,
            items: sortedItems.flat(),
        });
    }
}
