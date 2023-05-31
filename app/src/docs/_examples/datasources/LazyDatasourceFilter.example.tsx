import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { DatasourceViewer } from '@epam/uui-docs';
import { TApi } from '../../../data';
import { City } from '@epam/uui-docs';

export default function LazyDatasourceFilterExample() {
    const svc = useUuiContext<TApi>();

    const [value1, onValueChange1] = useState<DataSourceState<DataQueryFilter<City>>>({});
    const datasource1 = useLazyDataSource<City, string, DataQueryFilter<City>>({
        api: svc.api.demo.cities,
        filter: { country: 'GB' },
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState<DataQueryFilter<City>>>({
        filter: { population: '18392' },
    });
    const datasource2 = useLazyDataSource<City, string, DataQueryFilter<City>>({
        api: svc.api.demo.cities,
        filter: { country: 'GB' },
    }, []);
    
    const [value3, onValueChange3] = useState<DataSourceState<DataQueryFilter<City>>>({
        filter: { country: 'AI' },
    });
    const datasource3 = useLazyDataSource<City, string, DataQueryFilter<City>>({
        api: svc.api.demo.cities,
        filter: { country: 'GB' },
    }, []);

    return (
        <>
            <DatasourceViewer
                exampleTitle="filter: { country: 'GB' }"
                value={ value1 }
                onValueChange={ onValueChange1 }
                datasource={ datasource1 }
            />
            
            <DatasourceViewer
                exampleTitle="Merge of filters, filter: { country: 'GB', population: '18392' }"
                value={ value2 }
                onValueChange={ onValueChange2 }
                datasource={ datasource2 }
            />
            
            <DatasourceViewer
                exampleTitle="Merge of filters, state filter is overriding values of props filter"
                value={ value3 }
                onValueChange={ onValueChange3 }
                datasource={ datasource3 }
            />
        </>
    );
}
