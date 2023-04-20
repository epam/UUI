import React from 'react';
import { useUuiContext, UseFormProps, useForm as uuiUseForm, INotification } from '@epam/uui-core';
import { Text, RichTextView, WarningNotification } from '..';
import { ConfirmationModal } from '../overlays/ConfirmationModal';
import { i18n } from '../../i18n';

export function useForm<T>(props: UseFormProps<T>) {
    const context = useUuiContext();

    const beforeLeave = (): Promise<boolean> => {
        return context.uuiModals.show<boolean>((modalProps) => <ConfirmationModal caption={i18n.form.modals.beforeLeaveMessage} {...modalProps} />);
    };

    const loadUnsavedChanges = (): Promise<void> => {
        return context.uuiNotifications.show(
            (props: INotification) => (
                <WarningNotification
                    {...props}
                    actions={[
                        {
                            name: i18n.form.notifications.actionButtonCaption,
                            action: props.onSuccess,
                        },
                    ]}
                >
                    <RichTextView>
                        <Text size="36">{i18n.form.notifications.unsavedChangesMessage}</Text>
                    </RichTextView>
                </WarningNotification>
            ),
            { duration: 5, position: 'bot-left' }
        );
    };

    return uuiUseForm({ beforeLeave, loadUnsavedChanges, ...props });
}
