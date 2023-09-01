import React, { useState } from 'react';
import {
    ControlGroup, TextInput, PickerInput, TimePicker,
} from '@epam/promo';
import { useArrayDataSource } from '@epam/uui-core';
import { InputAddon } from '@epam/uui';

const languageLevels = [
    { id: 2, level: 'A1' }, { id: 3, level: 'A1+' }, { id: 4, level: 'A2' }, { id: 5, level: 'A2+' }, { id: 6, level: 'B1' }, { id: 7, level: 'B1+' }, { id: 8, level: 'B2' }, { id: 9, level: 'B2+' }, { id: 10, level: 'C1' }, { id: 11, level: 'C1+' }, { id: 12, level: 'C2' },
];

export default function PrefixExample() {
    const [valueTI, onValueTIChange] = useState(null);
    const [valueTP, onValueTPChange] = useState(null);
    const [multiPickerValue, multiOnValueChange] = useState(null);
    const dataSource = useArrayDataSource(
        {
            items: languageLevels,
        },
        [],
    );

    return (
        <>
            <ControlGroup>
                <InputAddon content="test" />
                <PickerInput
                    dataSource={ dataSource }
                    value={ multiPickerValue }
                    onValueChange={ multiOnValueChange }
                    getName={ (item) => item.level }
                    entityName="Level"
                    selectionMode="multi"
                    valueType="id"
                    sorting={ { field: 'level', direction: 'asc' } }
                />
            </ControlGroup>

            <ControlGroup>
                <InputAddon content="Time" />
                <TimePicker value={ valueTP } onValueChange={ onValueTPChange } />
            </ControlGroup>

            <ControlGroup>
                <div style={ { width: '50px' } }>
                    <TextInput value={ valueTI } onValueChange={ onValueTIChange } placeholder="05" />
                </div>
                <InputAddon content="h" />
            </ControlGroup>

        </>
    );
}
