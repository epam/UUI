import type { DataQueryFilter, FilterPredicate } from '@epam/uui-core';

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
            if ('in' in filterValue && (!Array.isArray(filterValue.in) || !filterValue.in.length)) {
                delete filter[key];
            }
            if ('nin' in filterValue && (!Array.isArray(filterValue.nin) || !filterValue.nin.length)) {
                delete filter[key];
            }
            if ('inRange' in filterValue) {
                if (!filterValue.inRange || (filterValue.inRange.from == null && filterValue.inRange.to == null)) {
                    delete filter[key];
                }
            }
            if ('notInRange' in filterValue) {
                if (!filterValue.notInRange || (filterValue.notInRange.from == null && filterValue.notInRange.to == null)) {
                    delete filter[key];
                }
            }
            Object.keys(filterValue).forEach((predicate) => {
                if (filterValue[predicate] === null || filterValue[predicate] === undefined) {
                    delete filter[key];
                }
            });
        }
    }
    return result;
};

export const getValue = (predicate: keyof FilterPredicate<any>, value: any) => predicate ? value?.[predicate] : value;
