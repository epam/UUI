import React, { useState } from 'react';
import {TabButton, FlexRow, FlexCell} from '@epam/promo';


export function BasicTabButtonExample() {
    const [value, onValueChange] = useState('Home');

    return (
        <FlexCell grow={ 1 }>
            <FlexRow borderBottom='gray40' background='none' >
                <TabButton
                    caption={ 'Main' }
                    isLinkActive={ value === 'Main' }
                    onClick={ () => onValueChange('Main') }
                    size='36'
                />
                <TabButton
                    caption='Home'
                    isLinkActive={ value === 'Home' }
                    onClick={ () => onValueChange('Home') }
                    size='36'
                />
                <TabButton
                    caption={ 'Tools' }
                    isLinkActive={ value === 'Tools' }
                    onClick={ () => onValueChange('Tools') }
                    count={ 18 }
                    size='36'
                />
                <TabButton
                    caption={ 'Options' }
                    isLinkActive={ value === 'Options' }
                    onClick={ () => onValueChange('Options') }
                    withNotify={ true }
                    size='36'
                />
            </FlexRow>
            <FlexRow borderBottom='gray40' background='none' >
                <TabButton
                    caption={ 'Main' }
                    isLinkActive={ value === 'Main' }
                    onClick={ () => onValueChange('Main') }
                    size='48'
                />
                <TabButton
                    caption='Home'
                    isLinkActive={ value === 'Home' }
                    onClick={ () => onValueChange('Home') }
                    size='48'
                />
                <TabButton
                    caption={ 'Tools' }
                    isLinkActive={ value === 'Tools' }
                    onClick={ () => onValueChange('Tools') }
                    count={ 18 }
                    size='48'
                />
                <TabButton
                    caption={ 'Options' }
                    isLinkActive={ value === 'Options' }
                    onClick={ () => onValueChange('Options') }
                    withNotify={ true }
                    size='48'
                />
            </FlexRow>
            <FlexRow borderBottom='gray40' background='none'>
                <TabButton
                    caption={ 'Main' }
                    isLinkActive={ value === 'Main' }
                    onClick={ () => onValueChange('Main') }
                    size='60'
                />
                <TabButton
                    caption='Home'
                    isLinkActive={ value === 'Home' }
                    onClick={ () => onValueChange('Home') }
                    size='60'
                />
                <TabButton
                    caption={ 'Tools' }
                    isLinkActive={ value === 'Tools' }
                    onClick={ () => onValueChange('Tools') }
                    count={ 18 }
                    size='60'
                />
                <TabButton
                    caption={ 'Options' }
                    isLinkActive={ value === 'Options' }
                    onClick={ () => onValueChange('Options') }
                    withNotify={ true }
                    size='60'
                />
            </FlexRow>
        </FlexCell>
    );
}