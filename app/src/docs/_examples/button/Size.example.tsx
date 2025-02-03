import React from 'react';
import { Button, ButtonProps } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

import css from './Button.module.scss';

export default function SizeExample(props: ExampleProps) {
    const sizes = getAllPropValues('size', true, props) as ButtonProps['size'][];

    return (
        <div className={ css.size }>
            {
                sizes?.map((size) => (
                    <Button key={ `size-${size}` } color="primary" size={ size } caption="Caption" />
                ))
            }
        </div>
    );
}
