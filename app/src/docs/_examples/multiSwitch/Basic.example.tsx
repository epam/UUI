import React, { useState } from 'react';
import { FlexCell, MultiSwitch, Text } from '@epam/promo';
import css from './BasicExample.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <Text>With Blue border</Text>
            <MultiSwitch
                items={ [{ id: 'on', caption: 'On' }, { id: 'off', caption: 'Off' }] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <MultiSwitch
                size="36"
                items={ [
                    { id: 1, caption: 'Mentee' }, { id: 2, caption: 'Mentor' }, { id: 3, caption: 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <Text>With Grey border</Text>
            <MultiSwitch
                size="36"
                items={ [
                    { id: 1, caption: 'Mentee' }, { id: 2, caption: 'Mentor' }, { id: 3, caption: 'Coordinator' },
                ] }
                color="gray50"
                value={ value }
                onValueChange={ onValueChange }
            />
            <Text>Disabled</Text>
            <MultiSwitch
                items={ [
                    { id: 1, caption: 'Mentee' }, { id: 2, caption: 'Mentor' }, { id: 3, caption: 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                isDisabled
            />
        </FlexCell>
    );
}
