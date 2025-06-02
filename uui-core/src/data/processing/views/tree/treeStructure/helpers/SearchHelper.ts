import { TreeStructure } from '../TreeStructure';
import { getSearchFilter } from '../../../../../querying';
import { ApplySearchToTreeSnapshotOptions, SearchOptions } from './types';
import { orderBy } from '../../../../../../helpers';
import { ITree } from '../../ITree';
import { NOT_FOUND_RECORD } from '../../constants';

export class SearchHelper {
    public static search<TItem, TId, TFilter>(
        options: SearchOptions<TItem, TId, TFilter>,
    ): ITree<TItem, TId> {
        const search = this.buildSearchFilter(options);
        return this.applySearchToTree({
            tree: options.tree,
            search,
            sortSearchByRelevance: options.sortSearchByRelevance,
        });
    }

    private static buildSearchFilter<TItem, TId, TFilter>({
        search,
        getSearchFields,
    }: SearchOptions<TItem, TId, TFilter>) {
        if (!search) return null;

        if (!getSearchFields) {
            console.warn(
                '[Tree] Search value is set, but options.getSearchField is not specified. Nothing to search on.',
            );
            return null;
        }
        const searchFilter = getSearchFilter(search);
        return (i: TItem) => searchFilter(getSearchFields(i));
    }

    private static applySearchToTree<TItem, TId>({
        tree,
        search,
        sortSearchByRelevance,
        newTreeInstance = (options) => TreeStructure.createFromItems(options),
    }: ApplySearchToTreeSnapshotOptions<TItem, TId>) {
        if (!search) return tree;

        const matchedItems: TItem[] = [];
        const ranks: Map<TId, number> = new Map();

        const applySearchRec = (parentId?: TId) => {
            let isSomeMatching: number | boolean = false;
            const { ids: children } = tree.getItems(parentId);
            children.forEach((id) => {
                const item = tree.getById(id);
                if (item === NOT_FOUND_RECORD) return;

                const isItemMatching = search(item);
                const isSomeChildMatching = applySearchRec(
                    id,
                );

                const isMatching = isItemMatching || isSomeChildMatching;
                if (isMatching !== false) {
                    matchedItems.push(item);
                    if (typeof isMatching !== 'boolean') {
                        const rank = ranks.has(id)
                            ? Math.max(ranks.get(id), isMatching)
                            : isMatching;
                        ranks.set(tree.getParams().getId(item), rank);
                    }
                }

                if (!isSomeMatching) {
                    isSomeMatching = isMatching;
                } else if (typeof isMatching === 'number') {
                    isSomeMatching = typeof isSomeMatching === 'number'
                        ? Math.max(isMatching, isSomeMatching)
                        : isMatching;
                }
            });

            return isSomeMatching;
        };

        applySearchRec(undefined);

        const searchItems = sortSearchByRelevance
            ? this.sortByRanks(
                matchedItems,
                ranks,
                tree.getParams().getId,
            )
            : matchedItems;

        return newTreeInstance({
            itemsAccessor: tree.getItemsAccessor(),
            params: tree.getParams(),
            items: searchItems,
        });
    }

    private static sortByRanks<TItem, TId>(
        items: TItem[],
        ranks: Map<TId, number>,
        getId: (item: TItem) => TId,
    ) {
        if (ranks.size === 0) {
            return items;
        }
        const itemsToSort = [...items];

        return orderBy(
            itemsToSort,
            (item) => {
                const id = getId(item);
                if (!ranks.has(id)) {
                    return 0;
                }
                return ranks.get(id);
            },
            'desc',
        );
    }
}
