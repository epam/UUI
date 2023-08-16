import React, { useState } from 'react';
import {
    FlexRow, FlexSpacer, Panel, Text, Button, CheckboxGroup,
} from '@epam/promo';
import { ReactComponent as myIcon } from '@epam/assets/icons/common/navigation-logout-12.svg';

import css from './FlexSpacerExample.module.scss';

export default function FlexSpacerExample() {
    const [value, onValueChange] = useState(null);

    return (
        <Panel background="white" shadow cx={ css.root }>
            <FlexRow padding="12" vPadding="18">
                <Text font="sans-semibold" size="48">
                    User settings
                </Text>
                <FlexSpacer />
                <Button caption="LogOut" size="30" icon={ myIcon } onClick={ () => null } color="gray" />
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

            <FlexRow padding="12" vPadding="12" spacing="12">
                <FlexSpacer />

                <Button caption="Create notification" onClick={ () => null } color="green" />
            </FlexRow>
        </Panel>
    );
}
