import React, { useState } from 'react';
import { PickerInput } from '@epam/loveship';
import { useArrayDataSource } from '@epam/uui-core';

const languageLevels = [
    { id: 2, level: 'A1' }, { id: 3, level: 'A1+' }, { id: 4, level: 'A2' }, { id: 5, level: 'A2+' }, { id: 6, level: 'B1' }, { id: 7, level: 'B1+' }, { id: 8, level: 'B2' }, { id: 9, level: 'B2+' }, { id: 10, level: 'C1' }, { id: 11, level: 'C1+' }, { id: 12, level: 'C2' },
];

interface ILoveshipPickerInputProps {
    type: 'single' | 'multi';
}

export const LoveshipPickerInput: React.FC<ILoveshipPickerInputProps> = ({ type }) => {
    const [value, setValue] = useState(null);

    const dataSource = useArrayDataSource(
        {
            items: languageLevels,
        },
        [],
    );

    return (
        <PickerInput
            value={ value }
            onValueChange={ setValue }
            dataSource={ dataSource }
            getName={ (item) => item.level }
            entityName="Language level"
            selectionMode={ type }
            valueType="id"
            sorting={ { field: 'level', direction: 'asc' } }
            placeholder={ type }
        />
    );
};
