import * as React from 'react';
import { FlexCell, MultiSwitch } from '@epam/promo';
import { useState } from 'react';
import * as css from './BasicExample.scss';

export function BasicExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width='auto' cx={ css.container } >
            <MultiSwitch
                items={ [
                    { 'id': 'on', 'caption': 'On' },
                    { 'id': 'off', 'caption': 'Off' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <MultiSwitch
                size='24'
                items={ [
                    { 'id': 1, 'caption': 'Mentee' },
                    { 'id': 2, 'caption': 'Mentor' },
                    { 'id': 3, 'caption': 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <MultiSwitch
                size='30'
                items={ [
                    { 'id': 1, 'caption': 'Mentee' },
                    { 'id': 2, 'caption': 'Mentor' },
                    { 'id': 3, 'caption': 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <MultiSwitch
                size='36'
                items={ [
                    { 'id': 1, 'caption': 'Mentee' },
                    { 'id': 2, 'caption': 'Mentor' },
                    { 'id': 3, 'caption': 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <MultiSwitch
                size='42'
                items={ [
                    { 'id': 1, 'caption': 'Mentee' },
                    { 'id': 2, 'caption': 'Mentor' },
                    { 'id': 3, 'caption': 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <MultiSwitch
                size='48'
                items={ [
                    { 'id': 1, 'caption': 'Mentee' },
                    { 'id': 2, 'caption': 'Mentor' },
                    { 'id': 3, 'caption': 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
            />
            <MultiSwitch
                items={ [
                    { 'id': 1, 'caption': 'Mentee' },
                    { 'id': 2, 'caption': 'Mentor' },
                    { 'id': 3, 'caption': 'Coordinator' },
                ] }
                value={ value }
                onValueChange={ onValueChange }
                isDisabled
            />
        </FlexCell>
    );
}