import * as React from 'react';
import { CheckboxGroup, FlexCell } from '@epam/promo';
import { useState } from 'react';
import * as css from './GroupExample.scss';

export function GroupExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width='auto' cx={ css.container } >
            <CheckboxGroup
                items={ [
                    { 'id': 1, 'name': 'Mentee' },
                    { 'id': 2, 'name': 'Mentor' },
                    { 'id': 3, 'name': 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                direction='vertical'
            />
            <CheckboxGroup
                items={ [
                    { 'id': 4, 'name': 'Mentee' },
                    { 'id': 5, 'name': 'Mentor' },
                    { 'id': 6, 'name': 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                direction='horizontal'
            />
        </FlexCell>
    );
}