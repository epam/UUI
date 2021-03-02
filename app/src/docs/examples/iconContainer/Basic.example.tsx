import * as React from 'react';
import { IconContainer } from '@epam/promo';
import * as eyeIcon24 from '@epam/assets/icons/common/action-eye-24.svg';
import * as accountIcon24 from '@epam/assets/icons/common/action-account-24.svg';

export function BasicIconContainerExample() {
    return (
        <>
            <IconContainer icon={ accountIcon24 } onClick={ () => null } />
            <IconContainer icon={ accountIcon24 } color='blue' flipY={ true } isDisabled={ true } onClick={ () => null } />
            <IconContainer icon={ eyeIcon24 } color='violet' style={ { 'transform': 'skew(-15deg, 18deg)' } } onClick={ () => null } />
        </>
    );
}