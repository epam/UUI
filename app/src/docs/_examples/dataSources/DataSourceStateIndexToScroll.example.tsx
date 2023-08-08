import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';
import { Button } from '@epam/promo';

const items = Array(1000).fill(0).map((_, index) => ({ id: index, name: `Parent ${index}` }));

export default function DataSourceStateVisibleCountExample() {
    const svc = useUuiContext();

    const [value1, onValueChange1] = useState<DataSourceState>({
        scrollTo: { index: 200 },
    });
    const dataSource1 = useLazyDataSource({ 
        api: svc.api.demo.countries,
    }, []);

    return (
        <>
            <Button onClick={ () => onValueChange1({ ...value1, scrollTo: { index: 0 } }) } caption="Scroll top" />
            <Button onClick={ () => onValueChange1({ ...value1, scrollTo: { index: 200 } }) } caption="Scroll bottom" />
            <DataSourceViewer
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
        </>
    );
}
