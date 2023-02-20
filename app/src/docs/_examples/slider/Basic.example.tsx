import React, { useState } from 'react';
import { FlexCell } from '@epam/promo';
import { Slider } from '@epam/loveship';
import css from './BasicExample.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(0);

    return (
        <FlexCell width="100%" cx={css.container}>
            <Slider min={0} max={150} step={5} splitAt={25} value={value} onValueChange={onValueChange} />
        </FlexCell>
    );
}
