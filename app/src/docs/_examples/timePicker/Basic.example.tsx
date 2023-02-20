import React, { useState } from 'react';
import { FlexRow, TimePicker } from '@epam/loveship';

export default function TimePickerBaseExample() {
    const [value, onValueChange] = useState({ hours: null, minutes: null });

    return (
        <FlexRow>
            <TimePicker value={value} onValueChange={onValueChange} />
        </FlexRow>
    );
}
