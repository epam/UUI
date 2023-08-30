import React from 'react';
import { IconButton } from '@epam/uui';
import { ReactComponent as ConfigIcon12 } from '@epam/assets/icons/common/action-settings-12.svg';
import { ReactComponent as EyeIcon18 } from '@epam/assets/icons/common/action-eye-18.svg';
import { ReactComponent as AccountIcon24 } from '@epam/assets/icons/common/action-account-24.svg';

export default function BasicIconButtonExample() {
    return (
        <>
            <IconButton icon={ AccountIcon24 } onClick={ () => null } />
            <IconButton icon={ AccountIcon24 } isDisabled={ true } onClick={ () => null } />
            <IconButton icon={ EyeIcon18 } color="info" onClick={ () => null } />
            <IconButton icon={ EyeIcon18 } onClick={ () => null } />
            <IconButton icon={ ConfigIcon12 } href="https://www.epam.com/" />
        </>
    );
}
