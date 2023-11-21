import React from 'react';
import { IconContainer } from '@epam/uui';
import { ReactComponent as EyeIcon24 } from '@epam/assets/icons/common/action-eye-24.svg';
import { ReactComponent as AccountIcon24 } from '@epam/assets/icons/common/action-account-24.svg';

export default function BasicIconContainerExample() {
    return (
        <>
            <IconContainer icon={ AccountIcon24 } />
            <IconContainer icon={ AccountIcon24 } style={ { fill: '#008ACE' } } flipY={ true } isDisabled={ true } />
            <IconContainer icon={ EyeIcon24 } style={ { transform: 'skew(-15deg, 18deg)', fill: '#88CC00' } } />
        </>
    );
}
