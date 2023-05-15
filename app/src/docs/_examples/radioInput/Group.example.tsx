import React, { useState } from 'react';
import { FlexCell, RadioGroup } from '@epam/promo';
import css from './GroupExample.module.scss';

export default function GroupExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <RadioGroup
                items={ [
                    { id: 1, name: 'Mentee' }, { id: 2, name: 'Mentor' }, { id: 3, name: 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                direction="vertical"
            />
            <RadioGroup
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
