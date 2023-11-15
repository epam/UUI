import React, { useState } from 'react';
import { FlexRow, TimePicker } from '@epam/uui';

export default function TimePickerBaseExample() {
    const [value, onValueChange] = useState({ hours: null, minutes: null });

    return (
        <FlexRow rawProps={ { style: { minWidth: '175px' } } }>
            <TimePicker value={ value } onValueChange={ onValueChange } />
        </FlexRow>
    );
}
