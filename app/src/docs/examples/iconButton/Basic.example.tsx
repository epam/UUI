import * as React from 'react';
import { IconButton } from '@epam/promo';
import * as configIcon12 from '@epam/assets/icons/common/action-settings-12.svg';
import * as eyeIcon18 from '@epam/assets/icons/common/action-eye-18.svg';
import * as accountIcon24 from '@epam/assets/icons/common/action-account-24.svg';

export function BasicIconButtonExample() {
    return (
        <>
            <IconButton icon={ accountIcon24 } onClick={ () => null } />
            <IconButton icon={ accountIcon24 }  isDisabled={ true } onClick={ () => null } />
            <IconButton icon={ eyeIcon18 } color='blue'  onClick={ () => null } />
            <IconButton icon={ eyeIcon18 } onClick={ () => null } />
            <IconButton icon={ configIcon12 } href='https://www.epam.com/' />
        </>
    );
}