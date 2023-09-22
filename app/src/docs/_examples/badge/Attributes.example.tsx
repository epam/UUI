import React from 'react';
import { Avatar, FlexCell, FlexRow, Panel, Text, Badge } from '@epam/uui';

import { ReactComponent as notificationIcon } from '@epam/assets/icons/common/notification-done-12.svg';
import css from './AttributesExample.module.scss';

export default function AttributesExample() {
    return (
        <Panel background="surface" shadow cx={ css.container }>
            <FlexRow cx={ css.containerItem }>
                <Avatar size="60" alt="avatar" img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" />
                <FlexRow padding="12">
                    <FlexCell width="auto">
                        <Text cx={ css.text } lineHeight="24" fontSize="18" color="primary" font="semibold">
                            John Doe
                        </Text>
                        <Text cx={ css.text } lineHeight="18" fontSize="12" color="secondary">
                            Corporate Function Management | L3
                        </Text>
                    </FlexCell>
                </FlexRow>
            </FlexRow>
            <FlexRow>
                <Panel>
                    <FlexRow alignItems="center" spacing="6">
                        <Badge color="success" size="24" fill="semitransparent" icon={ notificationIcon } caption="Available" />
                        <Badge color="info" size="24" fill="semitransparent" caption="Bench" />
                        <Badge color="warning" size="24" fill="semitransparent" caption="Remote" />
                    </FlexRow>
                </Panel>
            </FlexRow>
        </Panel>
    );
}
