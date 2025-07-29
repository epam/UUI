import React, { useState } from 'react';
import { TabButton, FlexRow, FlexCell } from '@epam/uui';

export default function BasicTabButtonExample() {
    const [value, onValueChange] = useState('plain');

    return (
        <FlexCell grow={ 1 }>
            <FlexRow borderBottom>
                <TabButton
                    caption="Plain"
                    isLinkActive={ value === 'plain' }
                    onClick={ () => onValueChange('plain') }
                />

                <TabButton
                    caption="With counter"
                    isLinkActive={ value === 'with-counter' }
                    onClick={ () => onValueChange('with-counter') }
                    count={ 18 }
                />

                <TabButton
                    caption="With notifier"
                    isLinkActive={ value === 'with-notifier' }
                    onClick={ () => onValueChange('with-notifier') }
                    withNotify={ true }
                />
            </FlexRow>
        </FlexCell>
    );
}
