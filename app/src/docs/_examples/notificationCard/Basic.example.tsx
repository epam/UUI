import React from 'react';
import { FlexCell, NotificationCard, Text } from '@epam/promo';
import css from './BasicExample.module.scss';

export default function BasicNotificationCardExample() {
    return (
        <FlexCell cx={ css.container }>
            <NotificationCard id={ 1 } key="keyProps" color="gray60" onClose={ () => alert('close action') } onSuccess={ () => null }>
                <Text size="36" font="sans" fontSize="14">
                    Common notification
                </Text>
            </NotificationCard>
        </FlexCell>
    );
}
