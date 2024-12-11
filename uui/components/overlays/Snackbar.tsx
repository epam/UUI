import * as React from 'react';
import { NotificationOperation, useUuiContext } from '@epam/uui-core';
import { SnackbarProps as UuiSnackbarProps, Snackbar as UuiSnackbar } from '@epam/uui-components';
import { ClearNotification } from './NotificationCard';
import { useEffect, useReducer } from 'react';

export interface SnackbarProps extends UuiSnackbarProps {}

export function Snackbar(props: SnackbarProps) {
    const uuiCtx = useUuiContext();
    const forceUpdate = useReliableForceUpdate();

    useEffect(() => uuiCtx.uuiNotifications.subscribe(() => forceUpdate()), []);

    let items: NotificationOperation[] = uuiCtx.uuiNotifications.getNotifications().slice().reverse();

    // add button for clear notification list
    if (items.length > 1) {
        const clearOperation: NotificationOperation = {
            component: ClearNotification,
            props: { id: 111555, key: 'clearNotification' },
            config: { position: items[0].config.position, duration: 'forever' },

        };
        items = [clearOperation].concat(items);
    }

    return <UuiSnackbar forwardedRef={ props.forwardedRef } notifications={ items } />;
}

/**
 *  https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
 */
function useReliableForceUpdate() {
    const red = useReducer((x) => x + 1, 0);
    return red[1];
}
