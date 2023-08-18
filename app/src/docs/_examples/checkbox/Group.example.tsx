import React, { useState } from 'react';
import { CheckboxGroup, FlexCell } from '@epam/uui';
import css from './GroupExample.module.scss';

export default function GroupExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <CheckboxGroup
                items={ [
                    { id: 1, name: 'Mentee' }, { id: 2, name: 'Mentor' }, { id: 3, name: 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                direction="vertical"
            />
            <CheckboxGroup
                items={ [
                    { id: 4, name: 'Mentee' }, { id: 5, name: 'Mentor' }, { id: 6, name: 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                direction="horizontal"
            />
        </FlexCell>
    );
}
