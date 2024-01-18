import { ApplySortOptions } from '../../../ITree';
import { SortOptions } from '../../types';
import { TreeStructure } from '../TreeStructure';

export class SortHelper {
    public static sort<TItem, TId, TFilter>({ treeStructure, ...options }: SortOptions<TItem, TId, TFilter>) {
        const sort = this.buildSorter(options);
        const sortedItems: TItem[] = [];
        const sortRec = (items: TItem[]) => {
            sortedItems.push(...sort(items));
            items.forEach((item) => {
                const children = treeStructure.getChildren(item);
                sortRec(children);
            });
        };

        sortRec(treeStructure.getRootItems());
        return TreeStructure.createFromItems({ params: treeStructure.params, items: sortedItems });
    }

    private static buildSorter<TItem, TId, TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) {
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
}
