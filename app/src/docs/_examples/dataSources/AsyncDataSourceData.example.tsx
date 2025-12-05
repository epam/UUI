import React, { useState } from 'react';
import { DataSourceState, useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';
import { TApi } from '../../../data';

export default function AsyncDataSourceDataExample() {
    const svc = useUuiContext<TApi>();

    const [value, onValueChange] = useState<DataSourceState>({});
    const dataSource = useAsyncDataSource({
        api: (options) => svc.api.demo.countries({}, options).then((res) => res.items),
    }, []);
    
    return (
        <DataSourceViewer
            value={ value }
            onValueChange={ onValueChange }
            dataSource={ dataSource }
        />
    );
}
