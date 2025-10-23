import React from 'react';
import { TabButton, FlexCell, FlexRow } from '@epam/uui';
import { ReactComponent as ContentFlagFillIcon } from '@epam/assets/icons/content-flag-fill.svg';

export default function BasicTabButtonExample() {
    return (
        <FlexCell width="auto">
            <FlexRow borderBottom>
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
            </FlexRow>
        </FlexCell>
    );
}
