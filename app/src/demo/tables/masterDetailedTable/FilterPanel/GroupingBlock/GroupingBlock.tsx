import React from 'react';
import { Accordion } from '@epam/uui';
import { LinkButton, RadioGroup } from '@epam/promo';
import { Grouping } from '../../types';
import css from './GroupingBlock.module.scss';

interface GroupingBlockProps { 
    groupings: Grouping[];
    value: string;
    onValueChange: (value: string) => void;
}

function GroupingBlock({ groupings, value, onValueChange }: GroupingBlockProps) {
    return (
        <Accordion title="Grouping" mode="inline" padding="18">
            <RadioGroup value={ value } onValueChange={ onValueChange } items={ groupings } cx={ css.radioGroupContainer } />
            <LinkButton caption="CLEAR" onClick={ () => onValueChange(undefined) } isDisabled={ value === undefined } />
        </Accordion>
    );
}

export default React.memo(GroupingBlock);
