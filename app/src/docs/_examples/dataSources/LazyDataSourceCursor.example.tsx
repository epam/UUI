import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';
import { TApi } from '../../../data';
import { City } from '@epam/uui-docs';

export default function LazyDataSourceDataExample() {
    const svc = useUuiContext<TApi>();

    const [value, onValueChange] = useState<DataSourceState>({});
    const dataSource = useLazyDataSource<City, string, DataQueryFilter<City>>({
        api: async (req) => {
            // We emulate server cursor-based API here.
            // Usually this done at server, and you need to pass cursor as is.

            // The server-side logic might be more complex, as we ignore several cases here:
            // - we assume the list is sorted by name, and sorting can't change
            //   To handle this, cursor would need to store field by which the list is sorted.
            // - we assume that names are unique.
            //   To handle this, we would need to add item ID to cursor, and make more complex filter, like:
            //     where (name > cursor.name) OR (name = cursor.name && id > cursor.id)
            //     order by name, id

            const { cursor, ...request } = req;

            if (cursor) {
                request.filter = request.filter || {};
                // fetch only cities with name after the last fetched city alphabetically
                request.filter.name = { gt: cursor };
                request.range = { ...request.range, from: 0 };
            }

            request.sorting = [{ field: 'name', direction: 'asc' }];

            const response = await svc.api.demo.cities(request);

            if (response.items.length > 0) {
                // store last item's name as cursor
                response.cursor = response.items[response.items.length - 1].name;
            }

            return response;
        },
    }, []);

    return (
        <DataSourceViewer
            value={ value }
            onValueChange={ onValueChange }
            dataSource={ dataSource }
        />
    );
}
