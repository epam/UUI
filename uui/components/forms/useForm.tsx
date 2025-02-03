import React, { useCallback } from 'react';
import {
    useUuiContext, UseFormProps, useForm as uuiUseForm, INotification,
} from '@epam/uui-core';
import { WarningNotification } from '../overlays';
import { Text, RichTextView } from '../typography';
import { ConfirmationModal } from '../overlays/ConfirmationModal';
import { i18n } from '../../i18n';

export function useForm<T>(props: UseFormProps<T>) {
    const context = useUuiContext();

    const beforeLeave = useCallback((): Promise<boolean> => {
        return context.uuiModals.show<boolean>((modalProps) => <ConfirmationModal caption={ i18n.form.modals.beforeLeaveMessage } { ...modalProps } />);
    }, [context.uuiModals]);

    const loadUnsavedChanges = (): Promise<void> => {
        return context.uuiNotifications.show(
            (props: INotification) => (
                <WarningNotification
                    { ...props }
                    actions={ [
                        {
                            name: i18n.form.notifications.actionButtonCaption,
                            action: props.onSuccess,
                        },
                    ] }
                >
                    <RichTextView>
                        <Text>{i18n.form.notifications.unsavedChangesMessage}</Text>
                    </RichTextView>
                </WarningNotification>
            ),
            { duration: 5, position: 'bot-left' },
        );
    };

    return uuiUseForm({ beforeLeave, loadUnsavedChanges, ...props });
}
