import { getSearchFilter } from '../../../querying';
import { LoadableTree } from './LoadableTree';
import {
    ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ITree,
} from './ITree';
import sortBy from 'lodash.sortby';

export class Tree<TItem, TId> extends LoadableTree<TItem, TId> {
    public filter<TFilter>(options: ApplyFilterOptions<TItem, TId, TFilter>): ITree<TItem, TId> {
        const filter = options.getFilter?.(options.filter);
        return this.applyFilterToTree(filter);
    }

    public search<TFilter>(options: ApplySearchOptions<TItem, TId, TFilter>): ITree<TItem, TId> {
        const search = this.buildSearchFilter(options);
        return this.applySearchToTree(search, options.sortSearchByRelevance);
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

    private buildSorter<TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) {
        const compareScalars = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
        const comparers: ((a: TItem, b: TItem) => number)[] = [];

        if (options.sorting) {
            options.sorting.forEach((sortingOption) => {
                const sortByFn = options.sortBy || ((i: TItem) => i[sortingOption.field as keyof TItem] || '');
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
                    const compare = comparers[n];
                    const result = compare(a, b);
                    if (result !== 0) {
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

    private applyFilterToTree(isMatchingFilterFn: undefined | ((item: TItem) => number | boolean)) {
        if (!isMatchingFilterFn) return this;

        const matchedItems: TItem[] = [];
        const applyFilterRec = (items: TItem[]) => {
            let isSomeMatching: number | boolean = false;
            items.forEach((item) => {
                const isItemMatching = isMatchingFilterFn(item);
                const isSomeChildMatching = applyFilterRec(this.getChildren(item));
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

        applyFilterRec(this.getRootItems());
        return Tree.create({ ...this.params }, matchedItems);
    }

    private applySearchToTree(isMatchingSearchFn: undefined | ((item: TItem) => number | boolean), sortSearchByRelevance?: boolean) {
        if (!isMatchingSearchFn) return this;

        const matchedItems: TItem[] = [];
        const ranks: Map<TId, number> = new Map();
        const applySearchRec = (items: TItem[]) => {
            let isSomeMatching: number | boolean = false;
            items.forEach((item) => {
                const isItemMatching = isMatchingSearchFn(item);
                const isSomeChildMatching = applySearchRec(this.getChildren(item));
                const isMatching = isItemMatching || isSomeChildMatching;
                if (isMatching !== false) {
                    matchedItems.push(item);
                    if (typeof isMatching !== 'boolean') {
                        const id = this.getId(item);
                        const rank = ranks.has(id) ? Math.max(ranks.get(id), isMatching) : isMatching;
                        ranks.set(this.getId(item), rank);
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

        applySearchRec(this.getRootItems());
        return Tree.create(
            { ...this.params },
            sortSearchByRelevance ? this.sortByRanks(matchedItems, ranks) : matchedItems,
        );
    }

    private sortByRanks = (items: TItem[], ranks: Map<TId, number>) => {
        if (ranks.size === 0) {
            return items;
        }
        const itemsToSort = [...items];

        return sortBy(itemsToSort, (item) => {
            const id = this.getId(item);
            if (!ranks.has(id)) {
                return 0;
            }
            return ranks.get(id) * -1;
        });
    };
}