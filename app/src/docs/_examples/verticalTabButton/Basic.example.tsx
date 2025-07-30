import React, { useState } from 'react';
import { CountIndicator, FlexCell, VerticalTabButton } from '@epam/uui';

export default function BasicTabButtonExample() {
    const [value, onValueChange] = useState('Home');

    const renderAddons = () => (
        <CountIndicator color="neutral" caption="18" size="18" />
    );

    return (
        <FlexCell grow={ 1 }>
            <VerticalTabButton caption="Main" isLinkActive={ value === 'Main' } onClick={ () => onValueChange('Main') } size="36" />
            <VerticalTabButton caption="Home" isLinkActive={ value === 'Home' } onClick={ () => onValueChange('Home') } size="36" />
            <VerticalTabButton caption="Tools" isLinkActive={ value === 'Tools' } onClick={ () => onValueChange('Tools') } renderAddons={ renderAddons } size="36" />
            <VerticalTabButton caption="Options" isLinkActive={ value === 'Options' } onClick={ () => onValueChange('Options') } withNotify={ true } size="36" />
        </FlexCell>
    );
}
