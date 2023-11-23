import React from 'react';
import { FlexCell, TextArea } from '@epam/uui';
import { useState } from 'react';
import css from './BasicExample.module.scss';

export default function HeightConfigurationExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width={ 350 } cx={ css.container }>
            <TextArea rows={ 6 } value={ value } onValueChange={ onValueChange } placeholder="6 rows" />
            <TextArea autoSize value={ value } onValueChange={ onValueChange } placeholder="autoSize" />
        </FlexCell>
    );
}
