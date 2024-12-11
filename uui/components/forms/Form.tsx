import * as React from 'react';
import {
    Form as UuiForm, FormProps, useUuiContext, INotification,
} from '@epam/uui-core';
import { Text, RichTextView } from '../typography';
import { ConfirmationModal, WarningNotification } from '../overlays';
import { i18n } from '../../i18n';

export function Form<T>(props: FormProps<T>) {
    const context = useUuiContext();

    const beforeLeave = React.useCallback((): Promise<boolean> => {
        return context.uuiModals.show<boolean>((modalProps) => <ConfirmationModal caption={ i18n.form.modals.beforeLeaveMessage } { ...modalProps } />);
    }, [context.uuiModals]);

    const loadUnsavedChanges = (): Promise<void> => {
        return context.uuiNotifications
            .show(
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

    return <UuiForm<T> loadUnsavedChanges={ loadUnsavedChanges } beforeLeave={ beforeLeave } { ...props } />;
}
