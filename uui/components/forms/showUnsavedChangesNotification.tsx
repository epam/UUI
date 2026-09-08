import React from 'react';
import { INotification, INotificationContext } from '@epam/uui-core';
import { WarningNotification } from '../overlays';
import { Text, RichTextView } from '../typography';
import { i18n } from '../../i18n';

export function showUnsavedChangesNotification(
    notifications: INotificationContext,
): Promise<void | boolean> {
    let isDeclined = false;

    return notifications
        .show(
            (props: INotification) => (
                <WarningNotification
                    { ...props }
                    actions={ [
                        {
                            name: i18n.form.notifications.actionButtonCaption,
                            action: props.onSuccess,
                        },
                        {
                            name: i18n.form.notifications.declineButtonCaption,
                            action: () => {
                                isDeclined = true;
                                props.onClose();
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
        )
        .catch(() => {
            if (isDeclined) {
                return false;
            }
            return Promise.reject();
        });
}
