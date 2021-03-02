import * as React from 'react';
import { Tag } from '@epam/promo';
import * as myIcon from '@epam/assets/icons/common/action-account-18.svg';
import { useState } from 'react';

export function BasicExample() {
    const [value, onValueChange] = useState<number>(123);

    return (
        <>
            <Tag caption='Simple Tag' />
            <Tag caption='Simple Tag' onClear={ () => null } />
            <Tag caption='Name Surname' icon={ myIcon } />
            <Tag caption='items selected' count={ value } />
        </>
    );
}