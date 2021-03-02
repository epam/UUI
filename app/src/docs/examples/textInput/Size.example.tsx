import * as React from 'react';
import { TextInput } from '@epam/promo';
import { useState } from 'react';

export function SizeExample() {
    const [value, onValueChange] = useState(null);

    return (
        <>
            <TextInput size='48' value={ value } onValueChange={ onValueChange } placeholder='Size 48px' />
            <TextInput size='42' value={ value } onValueChange={ onValueChange } placeholder='Size 42px' />
            <TextInput size='36' value={ value } onValueChange={ onValueChange } placeholder='Size 36px' />
            <TextInput size='30' value={ value } onValueChange={ onValueChange } placeholder='Size 30px' />
            <TextInput size='24' value={ value } onValueChange={ onValueChange } placeholder='Size 24px' />
        </>
    );
}