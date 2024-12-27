import React, { useState } from 'react';
import { FlexCell, Paginator, PaginatorProps } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';
import css from './BasicExample.module.scss';

export default function BasicAccordionExample(props: ExampleProps) {
    const [value, onValueChange] = useState<number>(5);
    const sizes = getAllPropValues('size', true, props) as PaginatorProps['size'][];

    return (
        <FlexCell width="100%" cx={ css.container }>
            {
                sizes.map((size) => (
                    <Paginator
                        key={ size }
                        size={ size }
                        totalPages={ 10 }
                        value={ value }
                        onValueChange={ onValueChange }
                    />
                ))
            }
        </FlexCell>
    );
}
