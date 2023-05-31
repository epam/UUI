import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { DatasourceViewer } from '@epam/uui-docs';
import { TApi } from '../../../data';
import { Location } from '@epam/uui-docs';

export default function LazyDatasourceGetChildCountExample() {
    const svc = useUuiContext<TApi>();

    const [value1, onValueChange1] = useState<DataSourceState>({});
    const datasource1 = useLazyDataSource<Location, string, DataQueryFilter<Location>>({
        api: (request, ctx) => {
            const { search } = request;
            // if search is specified, it is required to search over all the children,
            // and since parentId is meaningful value, it is required to exclude it from the filter.
            const filter = search ? {} : { parentId: ctx?.parentId };
            return svc.api.demo.locations({ ...request, search, filter });
        },
        getChildCount: () => 0,
        getParentId: (i) => i.parentId,
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const datasource2 = useLazyDataSource<Location, string, DataQueryFilter<Location>>({
        api: (request, ctx) => {
            const { search } = request;
            // if search is specified, it is required to search over all the children,
            // and since parentId is meaningful value, it is required to exclude it from the filter.
            const filter = search ? {} : { parentId: ctx?.parentId };
            return svc.api.demo.locations({ ...request, search, filter });
        },
        cascadeSelection: true,
        getId: (i) => i.id,
        getParentId: (i) => i.parentId,
        getChildCount: (l) => l.childCount,
    }, []);
    
    return (
        <>
            <DatasourceViewer
                exampleTitle="getChildCount returns 0"
                value={ value1 }
                onValueChange={ onValueChange1 }
                datasource={ datasource1 }
            />
    
            <DatasourceViewer
                exampleTitle="getChildCount returns real child count"
                value={ value2 }
                onValueChange={ onValueChange2 }
                datasource={ datasource2 }
            />
        </>
    );
}
