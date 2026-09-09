import * as React from 'react';
import { Form as UuiForm, FormProps, useUuiContext } from '@epam/uui-core';
import { ConfirmationModal } from '../overlays';
import { i18n } from '../../i18n';
import { showUnsavedChangesNotification } from './showUnsavedChangesNotification';

export function Form<T>(props: FormProps<T>) {
    const context = useUuiContext();

    const beforeLeave = React.useCallback((): Promise<boolean> => {
        return context.uuiModals.show<boolean>((modalProps) => <ConfirmationModal caption={ i18n.form.modals.beforeLeaveMessage } { ...modalProps } />);
    }, [context.uuiModals]);

    const loadUnsavedChanges = (): Promise<void | boolean> => {
        return showUnsavedChangesNotification(context.uuiNotifications);
    };

    return <UuiForm<T> loadUnsavedChanges={ loadUnsavedChanges } beforeLeave={ beforeLeave } { ...props } />;
}
