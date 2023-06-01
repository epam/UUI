import React, { useState } from 'react';
import { DataQueryFilter, DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';
import { TApi } from '../../../data';
import { City } from '@epam/uui-docs';

export default function LazyDataSourceFilterExample() {
    const svc = useUuiContext<TApi>();

    const [value1, onValueChange1] = useState<DataSourceState<DataQueryFilter<City>>>({});
    const dataSource1 = useLazyDataSource<City, string, DataQueryFilter<City>>({
        api: svc.api.demo.cities,
        filter: { country: 'GB' },
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState<DataQueryFilter<City>>>({
        filter: { population: '18392' },
    });
    const dataSource2 = useLazyDataSource<City, string, DataQueryFilter<City>>({
        api: svc.api.demo.cities,
        filter: { country: 'GB' },
    }, []);
    
    const [value3, onValueChange3] = useState<DataSourceState<DataQueryFilter<City>>>({
        filter: { country: 'AI' },
    });
    const dataSource3 = useLazyDataSource<City, string, DataQueryFilter<City>>({
        api: svc.api.demo.cities,
        filter: { country: 'GB' },
    }, []);

    return (
        <>
            <DataSourceViewer
                exampleTitle="filter: { country: 'GB' }"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
            
            <DataSourceViewer
                exampleTitle="Merge of filters, filter: { country: 'GB', population: '18392' }"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
            />
            
            <DataSourceViewer
                exampleTitle="Merge of filters, state filter is overriding values of props filter"
                value={ value3 }
                onValueChange={ onValueChange3 }
                dataSource={ dataSource3 }
            />
        </>
    );
}
