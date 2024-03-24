import React, { useState } from 'react';
import { demoData } from '@epam/uui-docs';
import { useArrayDataSource } from '@epam/uui-core';
import { FlexCell, PickerInput, Button, FlexRow } from '@epam/uui';

export default function AsyncPickerInputExample() {
    const [value, onValueChange] = useState<string[]>();

    const dataSource = useArrayDataSource({ items: demoData.languageLevels }, []);

    return (
        <FlexRow columnGap="12">
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                getName={ (i) => i.level }
                entityName="English level"
                selectionMode="single"
                valueType="id"
            />
            <FlexCell>
                <Button caption="Save" onClick={ () => {} } color="primary" />
            </FlexCell>
        </FlexRow>

    );
}
