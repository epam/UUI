import React, { useState } from 'react';
import { TextInput, TextInputProps } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function SizeExample(props: ExampleProps) {
    const [value, onValueChange] = useState(null);
    const sizes = getAllPropValues('size', true, props) as TextInputProps['size'][];

    return (
        <>
            { sizes.map((size) => (
                <TextInput
                    key={ size }
                    size={ size }
                    value={ value }
                    onValueChange={ onValueChange }
                    placeholder={ `Size ${size}px` }
                />
            )) }
        </>
    );
}
