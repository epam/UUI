import React, { useCallback, useState } from 'react';
import { DataSourceState, LazyDataSourceApiRequest, LazyDataSourceApiRequestContext, useLazyDataSource, useUuiContext, UuiContexts } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';
import { FlexRow, Paginator, Panel } from '@epam/promo';
import { Person } from '@epam/uui-docs';
import { TApi } from '../../../data';

export default function DataSourceStatePageExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const [value1, onValueChange1] = useState<DataSourceState>({
        page: 100,
        pageSize: 10,
    });

    const api = useCallback(async (rq: LazyDataSourceApiRequest<{}>, ctx: LazyDataSourceApiRequestContext<unknown, unknown>) => {
        const result = await svc.api.demo.personsPaged({
            ...rq,
            filter: rq.filter || {},
            page: rq.page,
            pageSize: rq.pageSize,
        }, { signal: ctx.signal });

        return {
            ...result,
            count: result.items.length,
            from: 0,
        };
    }, [svc.api.demo]);
    
    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: api,
            selectAll: false,
        },
        [],
    );

    return (
        <Panel>
            <FlexRow>
                <DataSourceViewer
                    value={ value1 }
                    onValueChange={ onValueChange1 }
                    dataSource={ dataSource }
                />
            </FlexRow>
            <FlexRow>
                <Paginator size="30" value={ value1.page } onValueChange={ (page) => onValueChange1({ ...value1, page }) } totalPages={ 100 } />
            </FlexRow>
        </Panel>
    );
}
