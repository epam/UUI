import type { DataQueryFilter, FilterPredicate } from '@epam/uui-core';

interface RangeValue {
    from?: string | number | null;
    to?: string | number | null;
}

/**
 * Checks if the value is a range object with at least one boundary property defined
 */
export const isValidRangeValue = (range: RangeValue | null | undefined): boolean => {
    return range != null && (range.from != null || range.to != null);
};

export const isFilledArray = (arr: any): boolean => {
    return Array.isArray(arr) && arr.length > 0;
};

export const hasSomeNullishProp = (obj: Record<string, unknown>): boolean => {
    return Object.keys(obj).some((prop) => obj[prop] == null);
};

const isValidArrayValue = isFilledArray;
const hasSomeNullishPredicate = hasSomeNullishProp;

export const normalizeFilterWithPredicates = <TFilter,>(filter: TFilter) => {
    if (!filter) {
        return {};
    }
    const result: DataQueryFilter<TFilter> = filter;
    const keys = Object.keys(filter) as (keyof TFilter)[];
    for (let n = 0; n < keys.length; n++) {
        const key = keys[n];
        const filterValue: any = filter[key];
        if (filterValue && typeof filterValue === 'object') {
            if (Object.keys(filterValue).length === 0) {
                delete filter[key];
                continue;
            }
            if ('from' in filterValue && 'to' in filterValue) {
                continue;
            }
            if ('in' in filterValue && !isValidArrayValue(filterValue.in)) {
                delete filter[key];
            }
            if ('nin' in filterValue && !isValidArrayValue(filterValue.nin)) {
                delete filter[key];
            }
            if ('inRange' in filterValue && !isValidRangeValue(filterValue.inRange)) {
                delete filter[key];
            }
            if ('notInRange' in filterValue && !isValidRangeValue(filterValue.notInRange)) {
                delete filter[key];
            }
            if (hasSomeNullishPredicate(filterValue)) {
                delete filter[key];
            }
        }
    }
    return result;
};

export const getValue = (predicate: keyof FilterPredicate<any>, value: any) => predicate ? value?.[predicate] : value;
