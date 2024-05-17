import { Comparator, FieldSortingSetting } from '../../../../../types';
import { ApplySortOptions } from '../../tree/treeState/types';

export function simpleComparator<T extends string | number>(a: T, b: T) {
    if (a == null) {
        if (b == null) {
            return 0;
        }
        return -1;
    }
    if (b == null) return 1;
    if (a < b) return -1;
    if (a === b) return 0;

    return 1;
}

export const buildComparators = <TItem, TId, TFilter>(
    options: ApplySortOptions<TItem, TId, TFilter>,
): Comparator[] => {
    if (options.sorting) {
        const compareScalars = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
        const sortingSettings = options.sorting.map<FieldSortingSetting<TItem> | FieldSortingSetting<TItem>[]>((sortingOption) => {
            const { field, direction } = sortingOption;
            const fieldSettings = options.sortingSettings?.[field as string];
            const customSettings = typeof fieldSettings === 'function' ? fieldSettings(sortingOption) : fieldSettings;
            const defaultSortBy = ((i: TItem) => i[sortingOption.field as keyof TItem] ?? '');
            const getSortingSettings = (s: FieldSortingSetting<TItem>): FieldSortingSetting<TItem> => ({
                sortBy: s?.sortBy ?? (options.sortBy ? ((item) => options.sortBy?.(item, sortingOption)) : defaultSortBy),
                direction: s?.direction ?? direction ?? 'asc',
                comparator: s?.comparator ?? options.comparator ?? compareScalars,
                field: field as string,
            });

            if (Array.isArray(customSettings)) {
                return customSettings.map((customSetting) => getSortingSettings({ ...customSetting, field: field as string }));
            }

            return getSortingSettings({ ...customSettings, field: field as string });
        }).flat();

        const sortingSettingsWithAlways = (options.overrideSortingSettings ?? ((s: FieldSortingSetting<TItem>[]) => s))(sortingSettings);

        return sortingSettingsWithAlways.map(({ direction, comparator = options.comparator ?? (compareScalars as Comparator), sortBy }) => {
            const sign = direction === 'desc' ? -1 : 1;
            return (a, b) => {
                const getValue = (item: TItem) => {
                    const v = sortBy(item);
                    if (v instanceof Date) {
                        return v;
                    }
                    return `${v}`;
                };

                return sign * comparator(getValue(a), getValue(b));
            };
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

export const getComparator = <TItem, TId, TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) => {
    const comparators = buildComparators(options);
    if (!comparators.length) {
        return null;
    }

    return composeComparators(comparators, options.getId);
};

export const buildSorter = <TItem, TId, TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) => {
    const composedComparator = getComparator(options);
    return (items: TItem[]) => {
        if (composedComparator === null) {
            return items;
        }

        items = [...items];
        items.sort(composedComparator);
        return items;
    };
};
