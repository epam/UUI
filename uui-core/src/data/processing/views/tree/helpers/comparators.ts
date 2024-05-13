import { FieldSortingSettings } from '../../../../../types';
import { SortingSettingsModifiers } from '../constants';
import { ApplySortOptions } from '../treeState/types';

export const simpleComparator = <T extends string | number>(a: T, b: T) => {
    if (a < b) {
        return -1;
    }

    return a === b ? 0 : 1;
};

export const buildComparators = <TItem, TId, TFilter>(
    options: ApplySortOptions<TItem, TId, TFilter>,
): ((a: TItem, b: TItem) => number)[] => {
    const { sorting } = options;
    if (sorting) {
        const compareScalars = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
        const sortingSettings = sorting.map<FieldSortingSettings<TItem> | FieldSortingSettings<TItem>[]>((sortingOption) => {
            const { field, direction } = sortingOption;
            const fieldSettings = options.sortingSettings?.[field as string];
            const settings = typeof fieldSettings === 'function' ? fieldSettings(sortingOption) : fieldSettings;
            const defaultSortBy = ((i: TItem) => i[sortingOption.field as keyof TItem] ?? '');
            const getSortingSettings = (s: FieldSortingSettings<TItem>) => ({
                sortBy: s?.sortBy ?? (options.sortBy ? ((item) => options.sortBy?.(item, sortingOption)) : defaultSortBy),
                direction: s?.direction ?? direction ?? 'asc',
                comparator: s?.comparator ?? compareScalars,
            });

            if (Array.isArray(settings)) {
                return settings.map(getSortingSettings);
            }

            return getSortingSettings(settings);
        }).flatMap<FieldSortingSettings<TItem>>((i) => i);

        const sortingSettingsWithAlways = (
            options.sortingSettings?.[SortingSettingsModifiers.ALWAYS]
            ?? ((s: FieldSortingSettings<TItem>[]) => s)
        )(sortingSettings);

        return sortingSettingsWithAlways.map(({ direction, comparator, sortBy }) => {
            const sign = direction === 'desc' ? -1 : 1;
            return (a, b) => sign * comparator(sortBy(a) + '', sortBy(b) + '');
        });
    }

    return [];
};

export const composeComparators = <TItem, TId>(comparators: ((a: TItem, b: TItem) => number)[], getId: (item: TItem) => TId) => {
    return (a: TItem, b: TItem) => {
        for (let n = 0; n < comparators.length; n++) {
            const compare = comparators[n];
            const result = compare(a, b);
            if (result !== 0) {
                return result;
            }
        }

        const aId = getId(a);
        const bId = getId(b);

        const aCompareId = typeof aId === 'object' && aId !== null ? JSON.stringify(aId) : aId as string | number;
        const bCompareId = typeof bId === 'object' && bId !== null ? JSON.stringify(bId) : bId as string | number;

        return simpleComparator(aCompareId, bCompareId);
    };
};

export const buildSorter = <TItem, TId, TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) => {
    const comparators = buildComparators(options);
    const composedComparator = composeComparators(comparators, options.getId);
    return (items: TItem[]) => {
        if (comparators.length === 0) {
            return items;
        }

        items = [...items];
        items.sort(composedComparator);
        return items;
    };
};
