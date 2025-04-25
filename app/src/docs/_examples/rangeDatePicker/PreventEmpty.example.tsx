import React, { useState } from 'react';
import { RangeDatePicker, FlexRow } from '@epam/uui';

export default function RangeDatePickerPreventEmptyExample() {
    const [value, onValueChange] = useState({ from: '24-04-2025', to: '30-04-2025' });

    return (
        <FlexRow>
            <RangeDatePicker preventEmptyFromDate={ true } preventEmptyToDate={ true } value={ value } onValueChange={ onValueChange } format="MMM D, YYYY" />
        </FlexRow>
    );
}
