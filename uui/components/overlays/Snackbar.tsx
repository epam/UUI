import * as React from 'react';
import { NotificationOperation, UuiContext, UuiContexts } from '@epam/uui-core';
import { SnackbarProps as UuiSnackbarProps, Snackbar as UuiSnackbar } from '@epam/uui-components';
import { ClearNotification } from '../../index';

export interface SnackbarProps extends UuiSnackbarProps {}

const SnackbarComponent = /* @__PURE__ */getSnackbarComponent();
export { SnackbarComponent as Snackbar };

function getSnackbarComponent() {
    return class Snackbar extends React.Component<SnackbarProps> {
        public static contextType = UuiContext;
        public context: UuiContexts;

        public componentDidMount() {
            this.context.uuiNotifications.subscribe(() => this.forceUpdate());
        }

        public render() {
            let items: NotificationOperation[] = this.context.uuiNotifications.getNotifications().slice().reverse();

            // add button for clear notification list
            if (items.length > 1) {
                const clearOperation: NotificationOperation = {
                    component: ClearNotification,
                    props: { id: 111555, key: 'clearNotification' },
                    config: { position: items[0].config.position, duration: 'forever' },

                };
                items = [clearOperation].concat(items);
            }

            return <UuiSnackbar forwardedRef={ this.props.forwardedRef } notifications={ items } />;
        }
    };
}
