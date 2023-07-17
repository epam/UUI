import React, { useState } from 'react';
import { DatePicker, FlexRow } from '@epam/promo';

export default function DatePickerFormatDateExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow>
            <DatePicker
                value={ value } // value format 'YYYY-MM-DD'
                onValueChange={ onValueChange }
                format="DD/MM/YYYY" // displayed day format
            />
        </FlexRow>
    );
}
