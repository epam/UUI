import { DataQuery } from '../../types/dataQuery';
import { getOrderComparer } from './getOrderComparer';
import { getFilterPredicate } from './getFilterPredicate';
import { getSearchFilter } from './getSearchFilter';
import { orderBy } from '../../helpers';
import { LazyDataSourceApiResponse } from '../../types/dataSources';

export function runDataQuery<TItem extends { id: any }>(
    allItems: TItem[],
    request: DataQuery<TItem> & { ids?: any[] },
    searchBy?: (item: TItem) => string[],
):LazyDataSourceApiResponse<TItem> {
    let items = allItems || [];
    request = request || {};

    if (request.ids) {
        return {
            items: items.filter((i) => request.ids.includes(i.id)),
        };
    }

    if (request.search) {
        searchBy = searchBy || ((i: any) => [i.name]);
        const searchFilter = getSearchFilter(request.search);
        items = items.filter((item) => searchFilter(searchBy(item)));
    }

    if (request.filter) {
        const predicate = getFilterPredicate(request.filter);
        items = items.filter(predicate);
    }

    if (request.sorting) {
        const comparer = getOrderComparer(request.sorting);
        items.sort(comparer);
    } else {
        items = orderBy(items, ({ name }: any) => name);
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
