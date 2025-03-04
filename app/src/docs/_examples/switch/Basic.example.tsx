import React, { useState } from 'react';
import { FlexCell, Switch, SwitchProps } from '@epam/uui';
import css from './BasicExample.module.scss';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function BasicExample(props: ExampleProps) {
    const [value, onValueChange] = useState(false);
    const sizes = getAllPropValues('size', true, props) as SwitchProps['size'][];

    return (
        <FlexCell width="auto" cx={ css.container }>
            <Switch label="Default" value={ value } onValueChange={ onValueChange } />
            {
                sizes?.map((size) => (
                    <Switch key={ `size-${size}` } label={ `Size ${size}px` } size={ size } value={ value } onValueChange={ onValueChange } />
                ))
            }
            <Switch label="Disabled" value={ value } onValueChange={ onValueChange } isDisabled />
        </FlexCell>
    );
}
