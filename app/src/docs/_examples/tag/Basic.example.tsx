import React, { useState } from 'react';
import { Tag } from '@epam/uui';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-account-18.svg';

export default function BasicExample() {
    const [value] = useState<number>(123);

    return (
        <>
            <Tag caption="Simple Tag" />
            <Tag caption="Simple Tag" onClear={ () => null } />
            <Tag caption="Name Surname" icon={ MyIcon } />
            <Tag caption="items selected" count={ value } />
        </>
    );
}
