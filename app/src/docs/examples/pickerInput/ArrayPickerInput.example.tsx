import React, { useState } from 'react';
import { FlexRow, PickerInput, FlexCell } from '@epam/promo';
import { useArrayDataSource } from '@epam/uui';

const languageLevels = [
    { "id": 2, "level": "A1" },
    { "id": 3, "level": "A1+" },
    { "id": 4, "level": "A2" },
    { "id": 5, "level": "A2+" },
    { "id": 6, "level": "B1" },
    { "id": 7, "level": "B1+" },
    { "id": 8, "level": "B2" },
    { "id": 9, "level": "B2+" },
    { "id": 10, "level": "C1" },
    { "id": 11, "level": "C1+" },
    { "id": 12, "level": "C2" },
];

export function LanguagesMultiPicker() {
    const [value, onValueChange] = useState(null);

    // Create DataSource outside the Picker, by calling useArrayDataSource hook
    const dataSource = useArrayDataSource({
        items: languageLevels,
    });

    return (
        <FlexCell width={ 600 }>
            <FlexRow spacing='12' >
                <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onValueChange }
                    getName={ item => item.level }
                    entityName='Language level'
                    selectionMode='multi'
                    valueType={ 'id' }
                    sorting={ { field: 'level', direction: 'asc' } }
                />
                <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onValueChange }
                    getName={ item => item.level }
                    entityName='Language level'
                    selectionMode='single'
                    valueType={ 'id' }
                    sorting={ { field: 'level', direction: 'asc' } }
                />
            </FlexRow>
        </FlexCell>

    );
}