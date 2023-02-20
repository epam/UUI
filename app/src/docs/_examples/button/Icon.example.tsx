import React from 'react';
import { Button } from '@epam/promo';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-eye-18.svg';

export default function ButtonWithIconExample() {
    return (
        <>
            <Button icon={MyIcon} caption="View" onClick={() => null} />
            <Button icon={MyIcon} iconPosition="right" caption="View" onClick={() => null} />
            <Button icon={MyIcon} iconPosition="right" caption="View" fill="light" onClick={() => null} />
            <Button icon={MyIcon} onClick={() => null} />
            <Button icon={MyIcon} fill="light" onClick={() => null} />
        </>
    );
}
