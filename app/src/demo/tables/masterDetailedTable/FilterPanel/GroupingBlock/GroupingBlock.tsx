import React from 'react';
import { Accordion, PickerList } from '@epam/uui';
import { groupingsDataSource } from '../../groupings';

interface GroupingBlockProps { 
    value: string[];
    onValueChange: (value: string[]) => void;
}

function GroupingBlock({ value, onValueChange }: GroupingBlockProps) {
    return (
        <Accordion title="Grouping" mode="inline" padding="18">
            <PickerList
                dataSource={ groupingsDataSource }
                selectionMode="multi"
                value={ value }
                onValueChange={ onValueChange }
                valueType="id"
            />
        </Accordion>
    );
}

export default React.memo(GroupingBlock);
