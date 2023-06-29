import { getSearchFilter } from '../../../querying';
import { LoadableTree } from './LoadableTree';
import {
    ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ITree,
} from './ITree';

export class Tree<TItem, TId> extends LoadableTree<TItem, TId> {
    public filter<TFilter>(options: ApplyFilterOptions<TItem, TId, TFilter>): ITree<TItem, TId> {
        const filter = options.getFilter?.(options.filter);
        return this.applyMatchToTree(filter);
    }

    public search<TFilter>(options: ApplySearchOptions<TItem, TId, TFilter>): ITree<TItem, TId> {
        const search = this.buildSearchFilter(options);
        return this.applyMatchToTree(search);
    }

    public sort<TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) {
        const sort = this.buildSorter(options);
        const sortedItems: TItem[] = [];
        const sortRec = (items: TItem[]) => {
            sortedItems.push(...sort(items));
            items.forEach((item) => {
                const children = this.getChildren(item);
                sortRec(children);
            });
        };

        sortRec(this.getRootItems());
        return Tree.create({ ...this.params }, sortedItems);
    }

    private buildSearchFilter<TFilter>({ search, getSearchFields }: ApplySearchOptions<TItem, TId, TFilter>) {
        if (!search) return null;

        if (!getSearchFields) {
            console.warn('[Tree] Search value is set, but options.getSearchField is not specified. Nothing to search on.');
            return null;
        }
        const searchFilter = getSearchFilter(search);
        return (i: TItem) => searchFilter(getSearchFields(i));
    }

    private buildSorter<TFilter>({ sorting, sortBy }: ApplySortOptions<TItem, TId, TFilter>) {
        const compareScalars = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
        const comparers: ((a: TItem, b: TItem) => number)[] = [];

        if (sorting) {
            sorting.forEach((sortingOption) => {
                const sortByFn = sortBy || ((i: TItem) => i[sortingOption.field as keyof TItem] || '');
                const sign = sortingOption.direction === 'desc' ? -1 : 1;
                comparers.push((a, b) => sign * compareScalars(sortByFn(a, sortingOption) + '', sortByFn(b, sortingOption) + ''));
            });
        }

        return (items: TItem[]) => {
            if (comparers.length === 0) {
                return items;
            }

            const indexes = new Map<TItem, number>();
            items.forEach((item, index) => indexes.set(item, index));

            const comparer = (a: TItem, b: TItem) => {
                for (let n = 0; n < comparers.length; n++) {
                    const comparer = comparers[n];
                    const result = comparer(a, b);
                    if (result != 0) {
                        return result;
                    }
                }

                // to make sort stable, compare items indices if other comparers return 0 (equal)
                return indexes.get(a) - indexes.get(b);
            };

            items = [...items];
            items.sort(comparer);
            return items;
        };
    }

    private applyMatchToTree(isMatchingFn: undefined | ((item: TItem) => number | boolean)) {
        if (!isMatchingFn) return this;

        const matchedItems: TItem[] = [];
        const ranks: Map<TId, number> = new Map();
        const applyMatchRec = (items: TItem[]) => {
            let isSomeMatching: number | boolean = false;
            items.forEach((item) => {
                const isItemMatching = isMatchingFn(item);
                const isSomeChildMatching = applyMatchRec(this.getChildren(item));
                const isMatching = isItemMatching || isSomeChildMatching;
                if (isMatching) {
                    matchedItems.push(item);
                    if (typeof isMatching !== 'boolean') {
                        ranks.set(this.getId(item), isMatching);
                    }
                }

                if (!isSomeMatching) {
                    isSomeMatching = isMatching;
                }
            });

            return isSomeMatching;
        };

        applyMatchRec(this.getRootItems());
        console.log(ranks);
        return Tree.create({ ...this.params }, this.sortByRanks(matchedItems, ranks));
    }

    private sortByRanks = (items: TItem[], ranks: Map<TId, number>) => {
        if (ranks.size === 0) {
            return items;
        }
        const itemsToSort = [...items];
        itemsToSort.sort((item1, item2) => {
            const id1 = this.getId(item1);
            const id2 = this.getId(item2);
            if (!ranks.has(id1) || !ranks.has(id2)) {
                return 0;
            }
            const rank1 = ranks.get(id1);
            const rank2 = ranks.get(id2);
            return rank2 - rank1;
        });
        return itemsToSort;
    };
}
