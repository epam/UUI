import React, { useState } from 'react';
import { NumericInput, NumericInputProps } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function SizeExample(props: ExampleProps) {
    const [value, onValueChange] = useState(null);
    const sizes = getAllPropValues('size', true, props) as NumericInputProps['size'][];

    return (
        <>
            {
                sizes.map((size) =>
                    (
                        <NumericInput
                            key={ size }
                            size={ size }
                            value={ value }
                            onValueChange={ onValueChange }
                            min={ -10 }
                            max={ 10 }
                        />
                    ))
            }
        </>
    );
}
