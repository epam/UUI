import React, { useState } from 'react';
import { FlexCell, RadioGroup } from '@epam/uui';
import css from './GroupExample.module.scss';

export default function GroupExample() {
    const [role, setRole] = useState(null);
    const [color, setColor] = useState(null);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <RadioGroup
                name="roles"
                items={ [
                    { id: 1, name: 'Mentee' }, { id: 2, name: 'Mentor' }, { id: 3, name: 'Coordinator' },
                ] }
                value={ role }
                onValueChange={ setRole }
                direction="vertical"
            />
            <RadioGroup
                name="colors"
                items={ [
                    { id: 4, name: 'Red' }, { id: 5, name: 'Yellow' }, { id: 6, name: 'Green' },
                ] }
                value={ color }
                onValueChange={ setColor }
                direction="horizontal"
            />
        </FlexCell>
    );
}
