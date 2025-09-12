import React from 'react';
import { TabButton, FlexCell } from '@epam/uui';
import { ReactComponent as ContentFlagFillIcon } from '@epam/assets/icons/content-flag-fill.svg';

export default function BasicTabButtonExample() {
    return (
        <FlexCell width={ 50 }>
            <TabButton
                caption="Tab"
            />

            <TabButton
                caption="Active Tab"
                isActive={ true }
            />

            <TabButton
                caption="Feature-rich Tab"
                count={ 18 }
                withNotify={ true }
                icon={ ContentFlagFillIcon }
            />
        </FlexCell>
    );
}
