import React from 'react';
import { FlexCell, NotificationCard, Text } from '@epam/promo';
import * as css from './BasicExample.scss';

export function BasicNotificationCardExample() {
    return (
        <FlexCell cx={ css.container }>
            <NotificationCard id={ 1 } key={ 'keyProps' } color='gray60' onClose={ () => null } onSuccess={ () => null } >
                <Text size='36' font='sans' fontSize='14'>Common notification</Text>
            </NotificationCard>
        </FlexCell>
    );
}