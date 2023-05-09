import React, { useState } from 'react';
import { RangeDatePicker, FlexRow } from '@epam/promo';

export default function DatePickerBaseExample() {
    const [value, onValueChange] = useState({ from: null, to: null });

    return (
        <FlexRow>
            <RangeDatePicker value={ value } onValueChange={ onValueChange } format="MMM D, YYYY" />
        </FlexRow>
    );
}
