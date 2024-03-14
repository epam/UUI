import React, { useState } from 'react';
import { DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';
import { Button, Panel, FlexRow, NumericInput } from '@epam/promo';

export default function DataSourceStateVisibleCountExample() {
    const svc = useUuiContext();

    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useLazyDataSource({ 
        api: svc.api.demo.countries,
    }, []);
    const [tempScrollTo, setTempScrollTo] = useState(value1.scrollTo?.index);

    return (
        <Panel>
            <FlexRow columnGap="12">
                <NumericInput
                    placeholder="Type index"
                    value={ tempScrollTo }
                    onValueChange={ (index) => {
                        setTempScrollTo(index);
                    } }
                /> 
                <Button onClick={ () => onValueChange1({ ...value1, scrollTo: { index: tempScrollTo } }) } caption="Scroll align='top'" />
                <Button onClick={ () => onValueChange1({ ...value1, scrollTo: { index: tempScrollTo, align: 'nearest' } }) } caption="Scroll align='nearest'" />
            </FlexRow>
            <DataSourceViewer
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
        </Panel>
    );
}
