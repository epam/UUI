import React from 'react';
import { NotificationOperation, NotificationContext } from '@epam/uui';
import { object } from 'prop-types';
import { SnackbarProps, Snackbar as UuiSnackbar } from '@epam/uui-components';
import { ClearNotification } from '.';

export class Snackbar extends React.Component<SnackbarProps> {
    static contextTypes = {
        uuiNotifications: object,
    };

    context: { uuiNotifications: NotificationContext };

    public componentDidMount() {
        this.context.uuiNotifications.subscribe(() => this.forceUpdate());
    }

    public render() {
        let items: NotificationOperation[] = this.context.uuiNotifications.getNotifications().slice().reverse();

        // add button for clear notification list
        if (items.length > 1) {
            let clearOperation: NotificationOperation = { component: ClearNotification, props: { id: null } as any, config: { position: items[0].config.position, duration: 'forever' } };
            items = [clearOperation].concat(items);
        }

        return <UuiSnackbar notifications={ items } />;
    }

}
