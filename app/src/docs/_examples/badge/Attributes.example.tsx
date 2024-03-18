import React from 'react';
import { Avatar, FlexCell, FlexRow, Panel, Text, Badge } from '@epam/uui';

import { ReactComponent as notificationIcon } from '@epam/assets/icons/notification-done-outline.svg';
import css from './AttributesExample.module.scss';

export default function AttributesExample() {
    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <FlexRow cx={ css.containerItem }>
                <Avatar size="60" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />
                <FlexRow padding="12">
                    <FlexCell width="auto">
                        <Text cx={ css.text } lineHeight="24" fontSize="18" color="primary" fontWeight="600">
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
                    <FlexRow alignItems="center" columnGap="6">
                        <Badge color="success" size="24" fill="outline" icon={ notificationIcon } caption="Available" />
                        <Badge color="info" size="24" fill="outline" caption="Bench" />
                        <Badge color="warning" size="24" fill="outline" caption="Remote" />
                    </FlexRow>
                </Panel>
            </FlexRow>
        </Panel>
    );
}
