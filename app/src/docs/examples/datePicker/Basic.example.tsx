import React, { useState } from 'react';
import { DatePicker, FlexRow } from '@epam/promo';

export const DatePickerBaseExample = () => {
    const [value, onValueChange] = useState('');

    return (
        <>
            <DatePicker
                value={ value }
                onValueChange={ onValueChange }
                format='MMM D, YYYY'
            />
        </>
    );
};