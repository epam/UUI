import React from 'react';
import { FlexCell, NotificationCard, Text } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicNotificationCardExample() {
    return (
        <FlexCell cx={ css.container }>
            <NotificationCard id={ 1 } key="keyProps" color="info" onClose={ () => alert('close action') } onSuccess={ () => null }>
                <Text>Common notification</Text>
            </NotificationCard>
        </FlexCell>
    );
}
