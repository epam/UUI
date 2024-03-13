import React, { useState } from 'react';
import { FlexRow, FlexSpacer, Panel, Text, Button, CheckboxGroup } from '@epam/uui';
import { ReactComponent as myIcon } from '@epam/assets/icons/common/navigation-logout-12.svg';

import css from './FlexSpacerExample.module.scss';

export default function FlexSpacerExample() {
    const [value, onValueChange] = useState(null);

    return (
        <Panel background="surface-main" shadow cx={ css.root }>
            <FlexRow padding="12" vPadding="18">
                <Text fontWeight="600" size="48">
                    User settings
                </Text>
                <FlexSpacer />
                <Button caption="LogOut" size="30" icon={ myIcon } onClick={ () => null } color="secondary" />
            </FlexRow>
            <FlexRow padding="12" vPadding="24">
                <CheckboxGroup
                    items={ [
                        { id: 1, name: 'Receive email notifications' }, { id: 2, name: 'Receive notifications via SMS' }, { id: 3, name: 'Receive notifications via WhatsApp' }, { id: 4, name: 'Receive notifications via Twitter' },
                    ] }
                    value={ value }
                    onValueChange={ onValueChange }
                    direction="vertical"
                />
            </FlexRow>

            <FlexSpacer />

            <FlexRow padding="12" vPadding="12" columnGap="12">
                <FlexSpacer />

                <Button caption="Create notification" onClick={ () => null } color="accent" />
            </FlexRow>
        </Panel>
    );
}
