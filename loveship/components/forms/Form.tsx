import React from 'react';
import { Form as UuiForm, FormProps, uuiContextTypes, UuiContexts, INotification } from '@epam/uui';
import { ConfirmationModal, Text, RichTextView, WarningNotification } from '..';
import { i18n } from '../../i18n';

export class Form<T> extends React.Component<FormProps<T>> {

    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    beforeLeave = (): Promise<boolean> => {
        return this.context.uuiModals
            .show<boolean>(modalProps => <ConfirmationModal caption={ i18n.form.modals.beforeLeaveMessage } { ...modalProps } />);
    }

    loadUnsavedChanges = (): Promise<void> => {
        return this.context.uuiNotifications.show((props: INotification) =>
            <WarningNotification { ...props } actions={
                [{
                    name: i18n.form.notifications.actionButtonCaption,
                    action: props.onSuccess,
                }]
            }>
                <RichTextView><Text size="36">{ i18n.form.notifications.unsavedChangesMessage }</Text></RichTextView>
            </WarningNotification>, { duration: 5, position: 'bot-left' });
    }

    render() {
        return <UuiForm<T> loadUnsavedChanges={ this.loadUnsavedChanges } beforeLeave={ this.beforeLeave } { ...this.props } />;
    }
}