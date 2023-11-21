import React, { useState } from 'react';
import { DatePicker, FlexRow } from '@epam/uui';

export default function DatePickerFormatDateExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow rawProps={ { style: { minWidth: '195px' } } }>
            <DatePicker
                value={ value } // value format 'YYYY-MM-DD'
                onValueChange={ onValueChange }
                format="DD/MM/YYYY" // displayed day format
            />
        </FlexRow>
    );
}
