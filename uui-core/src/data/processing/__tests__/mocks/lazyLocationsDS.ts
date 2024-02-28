import { demoData } from '@epam/uui-docs';
import { getLazyDataSourceMock } from '@epam/uui-test-utils';

import { LazyDataSourceProps } from '../../LazyDataSource';
import { DataQueryFilter } from '../../../../types';
import { runDataQuery } from '../../../querying';
import { buildSearchTree } from './buildSearchTree';
import { LocationItem } from './types';

type Props<TItem, TId, TFilter> = Partial<LazyDataSourceProps<TItem, TId, TFilter>>;

export function getLazyLocationsDS(props: Props<LocationItem, string, DataQueryFilter<LocationItem>>, delay?: number) {
    return getLazyDataSourceMock(
        demoData.locations,
        {
            getId: ({ id }) => id,
            getParentId: ({ parentId }) => parentId,
            getChildCount: ({ childCount }) => childCount,

            ...props,
        },
        delay,
    );
}

export function getLazyPagedLocationsDS(props: Props<LocationItem, string, DataQueryFilter<LocationItem>>) {
    return getLazyLocationsDS({
        api: async (request, ctx) => {
            const range = request.page != null || request.pageSize != null ? undefined : request.range;
            const data = runDataQuery(demoData.locations, ctx?.parent
                ? { ...request, filter: { parentId: ctx.parentId, ...request.filter } as DataQueryFilter<LocationItem>, range }
                : { ...request, filter: { parentId: { isNull: true }, ...request.filter } as DataQueryFilter<LocationItem>, range });

            if (request.page != null || request.pageSize != null) {
                const { page = 1, pageSize = 10 } = request;
                const from = page - 1;
                const items = data.items.slice(from * pageSize, (from + 1) * pageSize);
                return {
                    items,
                    totalCount: data.items.length,
                    count: request.page != null ? items.length : data.items.length,
                    pageCount: Math.ceil(data.items.length / pageSize),
                };
            }

            return data;
        },
        ...props,
    });
}

export function getLazyTreeSearchLocationsDS(props: Props<LocationItem, string, DataQueryFilter<LocationItem>> = {}) {
    return getLazyLocationsDS({
        api: async ({ range, ...request }, ctx) => {
            const { search } = request;
            if (search && ctx?.parentId) { // >1 level, search
                return Promise.resolve({ items: ctx?.parent?.children ?? [] });
            } else if (search) {
                const data = runDataQuery(demoData.locations, ctx?.parent
                    ? { ...request, filter: { parentId: ctx.parentId, ...request.filter } as DataQueryFilter<LocationItem> }
                    : { ...request, filter: request.filter as DataQueryFilter<LocationItem> });

                const tree = buildSearchTree(data.items, demoData.locations);

                return { items: tree };
            }

            const query = { ...request, filter: { parentId: ctx?.parentId ?? { isNull: true }, ...request?.filter } as DataQueryFilter<LocationItem> };
            const data = runDataQuery(demoData.locations, query);

            return { items: data.items };
        },
        ...props,
        flattenSearchResults: false,
    });
}
