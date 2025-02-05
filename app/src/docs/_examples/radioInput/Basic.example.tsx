import React, { useState } from 'react';
import { FlexCell, RadioInput, RadioInputProps } from '@epam/uui';
import { getAllPropValues } from '../utils';
import { ExampleProps } from '../types';
import css from './BasicExample.module.scss';

export default function BasicExample(props: ExampleProps) {
    const [value, onValueChange] = useState(false);
    const sizes = getAllPropValues('size', true, props) as RadioInputProps['size'][];

    return (
        <FlexCell width="auto" cx={ css.container }>
            <RadioInput label="Some label" value={ value } onValueChange={ onValueChange } />
            {
                sizes?.map((size) => (
                    <RadioInput key={ size } size={ size } label={ `Size ${size}px` } value={ value } onValueChange={ onValueChange } />
                ))
            }
            <RadioInput label="Disabled" value={ value } onValueChange={ onValueChange } isDisabled />
            <RadioInput label="Invalid" value={ value } onValueChange={ onValueChange } isInvalid />
        </FlexCell>
    );
}
