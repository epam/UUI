import React, { useState } from 'react';
import { DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';
import { Button, Panel, FlexRow } from '@epam/promo';

export default function DataSourceStateVisibleCountExample() {
    const svc = useUuiContext();

    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useLazyDataSource({ 
        api: svc.api.demo.countries,
    }, []);

    return (
        <Panel>
            <FlexRow spacing="12">
                <Button onClick={ () => onValueChange1({ ...value1, scrollTo: { index: 0 } }) } caption="Scroll top" />
                <Button onClick={ () => onValueChange1({ ...value1, scrollTo: { index: 200 } }) } caption="Scroll bottom" />
                <Button onClick={ () => onValueChange1({ ...value1, scrollTo: { index: 200, align: 'nearest' } }) } caption="Scroll nearest 200" />
            </FlexRow>
            <DataSourceViewer
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
        </Panel>
    );
}
