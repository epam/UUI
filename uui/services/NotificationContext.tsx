import * as React from 'react';
import clone from 'lodash.clone';
import { BaseContext } from './BaseContext';
import { NotificationParams, INotificationContext } from '../types/contexts';
import { LayoutContext } from './LayoutContext';
import { INotification } from '../types/props';

export interface NotificationOperation {
    component: React.ComponentClass<any>;
    props: INotification;
    config: NotificationParams;
}


let idCounter = 0;

export class NotificationContext extends BaseContext implements INotificationContext  {
    private notifications: NotificationOperation[] = [];

    constructor(private layoutCtx: LayoutContext) {
        super();
    }

    public show(render: (props: INotification) => React.ReactNode, notificationParams: NotificationParams): Promise<void> {
        let NotificationAdapter = class extends React.Component<INotification> {
            render() {
                return render(this.props);
            }
        };

        const params = {
            duration: 7,
            position: 'bot-left' as any,
            ...notificationParams,
        };

        return new Promise((resolve, reject) => {
            const layer = this.layoutCtx.getLayer();
            let durationTimer: any;

            let notificationProps: INotification = {
                onClose: () => {
                    this.remove(layer.id);
                    this.layoutCtx.releaseLayer(layer);
                    reject();
                    this.update({});
                },
                onSuccess : () => {
                    this.remove(layer.id);
                    this.layoutCtx.releaseLayer(layer);
                    resolve();
                    this.update({});
                },
                clearTimer: () => clearTimeout(durationTimer),
                refreshTimer: () => {
                    if (params.duration !== 'forever') {
                        durationTimer = setTimeout(() => {
                            notificationProps.onClose();
                        }, params.duration * 1000);
                    }
                },
                id: layer.id,
                key: (idCounter++) + '',
            };

            if (params.duration !== 'forever') {
                durationTimer = setTimeout(() => {
                    notificationProps.onClose();
                }, params.duration * 1000);
            }

            let operation: NotificationOperation = { component: NotificationAdapter, props: notificationProps, config: params};

            this.notifications.push(operation);

            this.update({});
        });
    }

    public getNotifications(): NotificationOperation[] {
        return this.notifications.map((op) => {
            op = clone(op);
            return op;
        });
    }

    public handleRedirect() {
        this.notifications = [];
    }

    public remove(id: number) {
        this.notifications = this.notifications.filter(i => i.props.id != id);
        this.update({});
    }

    public clearAll() {
        this.notifications = [];
        this.update({});
    }
}

