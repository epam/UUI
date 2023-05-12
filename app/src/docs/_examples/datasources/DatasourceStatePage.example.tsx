import React, { useCallback, useState } from 'react';
import { DataSourceState, LazyDataSourceApiRequest, useLazyDataSource, useUuiContext, UuiContexts } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';
import { Person } from '@epam/uui-docs';
import { TApi } from '../../../data';

export default function DatasourceStatePageExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const [value1, onValueChange1] = useState<DataSourceState>({
        page: 100,
        pageSize: 10,
    });
    const api = useCallback(async (rq: LazyDataSourceApiRequest<{}>) => {
        const result = await svc.api.demo.personsPaged({
            ...rq,
            filter: rq.filter || {},
            page: rq.page - 1,
            pageSize: rq.pageSize,
        });
        result.count = result.items.length;
        result.from = 0;
        return result;
    }, [svc.api.demo]);
    
    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: api,
            selectAll: false,
        },
        [],
    );

    return (
        <DatasourceViewer
            value={ value1 }
            onValueChange={ onValueChange1 }
            datasource={ dataSource }
        />
    );
}
