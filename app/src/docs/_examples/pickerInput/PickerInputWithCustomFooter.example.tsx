import React, { useState } from 'react';
import { FlexRow, PickerInput, FlexCell, Text } from '@epam/uui';
import { useArrayDataSource } from '@epam/uui-core';

const languageLevels = [
    { id: 2, level: 'A1' },
    { id: 3, level: 'A1+' },
    { id: 4, level: 'A2' },
    { id: 5, level: 'A2+' },
    { id: 6, level: 'B1' },
    { id: 7, level: 'B1+' },
    { id: 8, level: 'B2' },
    { id: 9, level: 'B2+' },
    { id: 10, level: 'C1' },
    { id: 11, level: 'C1+' },
    { id: 12, level: 'C2' },
];

export default function PickerInputWithCustomFooter() {
    const [singlePickerValue, singleOnValueChange] = useState(null);

    const dataSource = useArrayDataSource(
        {
            items: languageLevels,
        },
        [],
    );

    return (
        <FlexCell width={ 612 }>
            <FlexRow columnGap="12">
                <PickerInput
                    dataSource={ dataSource }
                    value={ singlePickerValue }
                    onValueChange={ singleOnValueChange }
                    getName={ (item) => item.level }
                    entityName="Language level"
                    selectionMode="single"
                    valueType="id"
                    sorting={ { field: 'level', direction: 'asc' } }
                    maxItems={ 3 }
                    renderFooter={ () => {
                        return (
                            <FlexRow padding="12">
                                <FlexCell width="auto">
                                    <Text color="primary">Language Levels according to the CEFR scale</Text>
                                </FlexCell>
                            </FlexRow>
                        );
                    } }
                />
            </FlexRow>
        </FlexCell>
    );
}
