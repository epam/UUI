import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { DatasourceViewer } from '@epam/uui-docs';
import { TApi } from '../../../data';
import { City } from '@epam/uui-docs';

export default function LazyDatasourceDataExample() {
    const svc = useUuiContext<TApi>();

    const [value, onValueChange] = useState<DataSourceState>({});
    const datasource = useLazyDataSource<City, string, DataQueryFilter<City>>({
        api: (req) => svc.api.demo.cities(req),
    }, []);
    
    return (
        <DatasourceViewer
            value={ value }
            onValueChange={ onValueChange }
            datasource={ datasource }
        />
    );
}
