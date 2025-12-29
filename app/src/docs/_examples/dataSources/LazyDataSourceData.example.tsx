import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';
import { TApi } from '../../../data';
import { City } from '@epam/uui-docs';

export default function LazyDataSourceDataExample() {
    const svc = useUuiContext<TApi>();

    const [value, onValueChange] = useState<DataSourceState>({});
    const dataSource = useLazyDataSource<City, string, DataQueryFilter<City>>({
        api: (req, ctx) => svc.api.demo.cities(req, ctx),
    }, []);
    
    return (
        <DataSourceViewer
            value={ value }
            onValueChange={ onValueChange }
            dataSource={ dataSource }
        />
    );
}
