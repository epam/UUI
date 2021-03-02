import { DataQuery } from "../../types";
import {getOrderComparer} from "./getOrderComparer";
import {getPatternPredicate} from "./getPatternPredicate";
import { getSearchFilter } from './getSearchFilter';
import orderBy from 'lodash.orderby';

export function runDataQuery<TItem>(allItems: TItem[], request: DataQuery<TItem>, searchBy?: (item: TItem) => string[]) {
    let items = allItems || [];
    request = request || {};

    if (request.search) {
        searchBy = searchBy || ((i: any) => i.name);
        const searchFilter = getSearchFilter(request.search);
        items = items.filter(item => searchFilter(searchBy(item)));
    }

    if (request.filter) {
        const predicate = getPatternPredicate(request.filter);
        items = items.filter(predicate);
    }

    if (request.sorting) {
        const comparer = getOrderComparer(request.sorting);
        items.sort(comparer);
    } else {
        items = orderBy(items, 'name');
    }

    const filteredAndSorted = items;

    if (request.range) {
        const from = request.range.from || 0;
        const count = request.range.count == null ? items.length : request.range.count;
        items = items.slice(from, from + count);
    }

    return {
        items,
        count: filteredAndSorted.length,
    };
}
