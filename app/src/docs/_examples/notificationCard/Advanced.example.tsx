import React from 'react';
import { FlexCell, NotificationCard, Text, RichTextView, Anchor } from '@epam/uui';
import css from './BasicExample.module.scss';
import { ReactComponent as AccountIcon24 } from '@epam/assets/icons/common/action-account-24.svg';

export default function AdvancedExample() {
    const actions = [{ name: 'Ok', action: () => {} }, { name: 'Cancel', action: () => {} }];

    return (
        <FlexCell width={ 350 } cx={ css.container }>
            <NotificationCard id={ 1 } key="propsKey1" actions={ actions } color="warning" icon={ AccountIcon24 } onClose={ () => alert('close action') } onSuccess={ () => null }>
                <Text>Warning notification with some buttons</Text>
            </NotificationCard>
            <NotificationCard id={ 2 } key="propsKey2" actions={ actions } color="success" icon={ AccountIcon24 } onClose={ () => alert('close action') } onSuccess={ () => null }>
                <Text>Notification text message when it has a lot of text message</Text>
            </NotificationCard>
            <NotificationCard id={ 3 } key="propsKey3" actions={ actions } color="error" icon={ AccountIcon24 } onClose={ () => alert('close action') } onSuccess={ () => null }>
                <Text fontWeight="600">Notification title, some long title can be here, even 2nd row appears</Text>
                <Text>Notification text message when it has a lot of text message</Text>
            </NotificationCard>
            <NotificationCard id={ 4 } key="propsKey4" actions={ actions } color="info" icon={ AccountIcon24 } onClose={ () => alert('close action') } onSuccess={ () => null }>
                <RichTextView>
                    Any your text with
                    {' '}
                    <Anchor href="https://uui.epam.com/">link</Anchor>
                    .
                </RichTextView>
            </NotificationCard>
        </FlexCell>
    );
}
