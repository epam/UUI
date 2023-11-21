import React from 'react';
import { FlexCell, NotificationCard, Text } from '@epam/uui';
import css from './BasicExample.module.scss';
import { ReactComponent as AccountIcon24 } from '@epam/assets/icons/common/action-account-24.svg';

export default function AdvancedExample() {
    const actions = [{ name: 'Ok', action: () => {} }, { name: 'Cancel', action: () => {} }];

    return (
        <FlexCell width={ 350 } cx={ css.container }>
            <NotificationCard id={ 1 } key="propsKey" actions={ actions } color="warning" icon={ AccountIcon24 } onClose={ () => alert('close action') } onSuccess={ () => null }>
                <Text>Warning notification with some buttons</Text>
            </NotificationCard>
        </FlexCell>
    );
}
