import { NOT_FOUND_RECORD } from '../../constants';
import { buildSorter } from '../../helpers';
import { ITree } from '../../ITree';
import { TreeStructure } from '../TreeStructure';
import type { SortOptions } from './types';

export class SortHelper {
    public static sort<TItem, TId, TFilter>({
        tree,
        newTreeInstance = (options) => TreeStructure.createFromItems(options),
        ...options
    }: SortOptions<TItem, TId, TFilter>) {
        const sort = buildSorter({ ...options, getId: tree.getParams().getId });
        const sortedItems: TItem[][] = [];
        const sortRec = (items: TItem[]) => {
            sortedItems.push(sort(items));
            items.forEach((item) => {
                const id = tree.getParams().getId(item);
                sortRec(SortHelper.getItems(tree, id));
            });
        };

        sortRec(SortHelper.getItems(tree, undefined));
        return newTreeInstance({
            params: tree.getParams(),
            items: sortedItems.flat(),
            itemsAccessor: tree.getItemsAccessor(),
        });
    }

    private static getItems<TItem, TId>(tree: ITree<TItem, TId>, parentId: TId) {
        const { ids = [] } = tree.getItems(parentId);
        return ids.map((i) => tree.getById(i)).filter((i): i is TItem => i !== NOT_FOUND_RECORD);
    }
}
