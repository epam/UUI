import React, { useCallback } from 'react';
import { useUuiContext, UseFormProps, useForm as uuiUseForm } from '@epam/uui-core';
import { ConfirmationModal } from '../overlays/ConfirmationModal';
import { i18n } from '../../i18n';
import { showUnsavedChangesNotification } from './showUnsavedChangesNotification';

export function useForm<T>(props: UseFormProps<T>) {
    const context = useUuiContext();

    const beforeLeave = useCallback((): Promise<boolean> => {
        return context.uuiModals.show<boolean>((modalProps) => <ConfirmationModal caption={ i18n.form.modals.beforeLeaveMessage } { ...modalProps } />);
    }, [context.uuiModals]);

    const loadUnsavedChanges = (): Promise<void | boolean> => {
        return showUnsavedChangesNotification(context.uuiNotifications);
    };

    return uuiUseForm({ beforeLeave, loadUnsavedChanges, ...props });
}
