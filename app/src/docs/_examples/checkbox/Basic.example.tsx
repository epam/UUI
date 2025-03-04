import React, { useState } from 'react';
import { Checkbox, CheckboxProps, FlexCell } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

import css from './BasicExample.module.scss';

export default function BasicExample(props: ExampleProps) {
    const [value, onValueChange] = useState(null);
    const sizes = getAllPropValues('size', true, props) as CheckboxProps['size'][];

    return (
        <FlexCell width="auto" cx={ css.container }>
            <Checkbox label="Some label" value={ value } onValueChange={ onValueChange } />
            {
                sizes?.map((size) => (
                    <Checkbox key={ `size-${size}` } label={ `Size ${size}px` } size={ size } value={ value } onValueChange={ onValueChange } />
                ))
            }
            <Checkbox label="Readonly, indeterminate" indeterminate={ true } isReadonly={ true } value={ value } onValueChange={ onValueChange } />
            <Checkbox label="Disabled" value={ value } onValueChange={ onValueChange } isDisabled />
            <Checkbox label="Invalid" value={ value } onValueChange={ onValueChange } isInvalid />
        </FlexCell>
    );
}
