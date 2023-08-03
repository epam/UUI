import React from 'react';
import { Accordion } from '@epam/uui';
import { RadioGroup } from '@epam/promo';
import { Grouping } from '../../types';

interface GroupingBlockProps { 
    groupings: Grouping[];
    value: string;
    onValueChange: (value: string) => void;
}

function GroupingBlock({ groupings, value, onValueChange }: GroupingBlockProps) {
    return (
        <Accordion title="Grouping" mode="inline" padding="18">
            <RadioGroup value={ value } onValueChange={ onValueChange } items={ groupings } />
        </Accordion>
    );
}

export default React.memo(GroupingBlock);
