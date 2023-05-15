import React, { useState } from 'react';
import { DataSourceState, useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';
import { TApi } from '../../../data';

export default function AsyncDatasourceDataExample() {
    const svc = useUuiContext<TApi>();

    const [value, onValueChange] = useState<DataSourceState>({});
    const datasource = useAsyncDataSource({
        api: () => svc.api.demo.countries({}).then((res) => res.items),
    }, []);
    
    return (
        <DatasourceViewer
            value={ value }
            onValueChange={ onValueChange }
            datasource={ datasource }
        />
    );
}
