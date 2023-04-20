import React, { useState } from 'react';
import { NumericInput } from '@epam/promo';

export default function SizeExample() {
    const [value, onValueChange] = useState(null);

    return (
        <>
            <NumericInput size="48" value={value} onValueChange={onValueChange} min={-10} max={10} />
            <NumericInput size="42" value={value} onValueChange={onValueChange} min={-10} max={10} />
            <NumericInput size="36" value={value} onValueChange={onValueChange} min={-10} max={10} />
            <NumericInput size="30" value={value} onValueChange={onValueChange} min={-10} max={10} />
            <NumericInput size="24" value={value} onValueChange={onValueChange} min={-10} max={10} />
        </>
    );
}
