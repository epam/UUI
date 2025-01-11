import React from 'react';
import { Avatar, Badge, FlexCell, FlexRow, LinkButton, Panel, Text } from '@epam/uui';
import { ReactComponent as navigationIcon } from '@epam/assets/icons/navigation-chevron_right-outline.svg';
import { ReactComponent as notificationIcon } from '@epam/assets/icons/notification-done-fill.svg';
import css from './CardExample.module.scss';

export default function AttributesExample() {
    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <div className={ css.wrapper }>
                <FlexRow>
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
                <FlexRow alignItems="center" columnGap="6">
                    <Badge color="success" size="24" fill="outline" icon={ notificationIcon } caption="Available" />
                    <Badge color="info" size="24" fill="outline" caption="Bench" />
                    <Badge color="warning" size="24" fill="outline" caption="Remote" />
                </FlexRow>
            </div>
            <div className={ css.divider } />
            <div className={ css.wrapper }>
                <FlexRow>
                    <LinkButton caption="Show Reporting Line" link={ { pathname: '/' } } size="24" icon={ navigationIcon } iconPosition="right" />
                </FlexRow>
            </div>
        </Panel>
    );
}
