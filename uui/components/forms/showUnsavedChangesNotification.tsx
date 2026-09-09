import React from 'react';
import { INotification, INotificationContext } from '@epam/uui-core';
import { WarningNotification } from '../overlays';
import { Text, RichTextView } from '../typography';
import { i18n } from '../../i18n';

export async function showUnsavedChangesNotification(
    notifications: INotificationContext,
): Promise<boolean> {
    let restore = false;

    await notifications
        .show(
            (props: INotification) => (
                <WarningNotification
                    { ...props }
                    actions={ [
                        {
                            name: i18n.form.notifications.actionButtonCaption,
                            action: () => {
                                restore = true;
                                props.onSuccess();
                            },
                        },
                        {
                            name: i18n.form.notifications.declineButtonCaption,
                            action: () => {
                                restore = false;
                                props.onSuccess();
                            },
                        },
                    ] }
                >
                    <RichTextView>
                        <Text>{ i18n.form.notifications.unsavedChangesMessage }</Text>
                    </RichTextView>
                </WarningNotification>
            ),
            { duration: 5, position: 'bot-left' },
        );

    return restore;
}
