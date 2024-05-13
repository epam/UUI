import React, { useState } from 'react';
import {
    ControlGroup, TextInput, PickerInput, TimePicker,
} from '@epam/promo';
import { useArrayDataSource } from '@epam/uui-core';
import { InputAddon } from '@epam/uui';

const vendorsList = [
    { id: 2, level: 'Victor Grudenberg' }, { id: 3, level: 'John Halivanger' }, { id: 4, level: 'Alex Yetisport' }, { id: 5, level: 'Peter Bremen' }, { id: 6, level: 'John Halivanger' }, { id: 7, level: 'Pablo Lipa' },
];

export default function PrefixExample() {
    const [valueTI, onValueTIChange] = useState(null);
    const [valueTP, onValueTPChange] = useState(null);
    const [multiPickerValue, multiOnValueChange] = useState(null);
    const dataSource = useArrayDataSource(
        {
            items: vendorsList,
        },
        [],
    );

    return (
        <>
            <ControlGroup>
                <InputAddon content="Vendor" />
                <PickerInput
                    dataSource={ dataSource }
                    value={ multiPickerValue }
                    onValueChange={ multiOnValueChange }
                    getName={ (item) => item.level }
                    entityName="Vendor"
                    placeholder="All vendors"
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
                <TextInput rawProps={ { style: { width: '50px' } } } value={ valueTI } onValueChange={ onValueTIChange } placeholder="05" />
                <InputAddon content="h" />
            </ControlGroup>

        </>
    );
}
