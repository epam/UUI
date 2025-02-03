import React, { useState } from 'react';
import { FlexCell, Paginator } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicAccordionExample() {
    const [value1, onValueChange1] = useState<number>(1);
    const [value2, onValueChange2] = useState<number>(5);

    return (
        <FlexCell width="100%" cx={ css.container }>
            <Paginator totalPages={ 5 } value={ value1 } onValueChange={ onValueChange1 } />
            <Paginator totalPages={ 10 } value={ value2 } onValueChange={ onValueChange2 } />
        </FlexCell>
    );
}
