import * as React from 'react';
import { BaseContext } from './BaseContext';
import { NotificationParams, INotificationContext } from '../types/contexts';
import { LayoutContext } from './LayoutContext';
import { INotification } from '../types/props';

let idCounter = 0;

export interface NotificationOperation {
    /** Notification component that should be rendered */
    component: React.ComponentType<any>;
    /** Notification component props */
    props: INotification;
    /** Notification config */
    config: NotificationParams;
}

export class NotificationContext extends BaseContext implements INotificationContext {
    private notifications: NotificationOperation[] = [];
    constructor(private layoutCtx: LayoutContext) {
        super();
    }

    public destroyContext() {
        this.clearAll();
        super.destroyContext();
    }

    public show(render: (props: INotification) => React.ReactNode, notificationParams: NotificationParams): Promise<void> {
        const NotificationAdapter = class extends React.Component<INotification> {
            render() {
                return render(this.props);
            }
        };

        const params: NotificationParams = {
            duration: 7,
            position: 'bot-left',
            ...notificationParams,
        };

        return new Promise((resolve, reject) => {
            const layer = this.layoutCtx.getLayer();
            let durationTimer: ReturnType<typeof setTimeout>;

            const notificationProps: INotification = {
                onClose: () => {
                    this.remove(layer.id);
                    this.layoutCtx.releaseLayer(layer);
                    reject();
                    this.update({});
                },
                onSuccess: () => {
                    this.remove(layer.id);
                    this.layoutCtx.releaseLayer(layer);
                    resolve();
                    this.update({});
                },
                clearTimer: () => clearTimeout(durationTimer),
                refreshTimer: () => {
                    if (params.duration !== 'forever') {
                        clearTimeout(durationTimer);
                        durationTimer = setTimeout(() => {
                            notificationProps.onClose();
                        }, params.duration * 1000);
                    }
                },
                id: layer.id,
                key: idCounter++ + '',
            };

            if (params.duration !== 'forever') {
                durationTimer = setTimeout(() => {
                    notificationProps.onClose();
                }, params.duration * 1000);
            }

            const operation: NotificationOperation = { component: NotificationAdapter, props: notificationProps, config: params };

            this.notifications.push(operation);

            this.update({});
        });
    }

    public getNotifications(): NotificationOperation[] {
        return this.notifications;
    }

    public handleRedirect() {
        this.notifications = [];
    }

    public remove(id: number) {
        this.notifications = this.notifications.filter((i) => i.props.id !== id);
        this.update({});
    }

    public clearAll() {
        this.notifications = [];
        this.update({});
    }
}
