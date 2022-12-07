import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext, colorDoc, iconWithInfoDoc } from '../../../docs';
import { Text } from '../../typography';
import { NotificationCard, NotificationCardProps } from '../NotificationCard';

const SnackbarCardDoc = new DocBuilder<NotificationCardProps>({ name: 'NotificationCard', component: NotificationCard })
    .implements([iconWithInfoDoc, colorDoc])
    .prop('children', {
        examples: [
            {
                value: <Text size="36" font='sans' >Warning notification</Text>,
                name: 'Short',
            },
            {
                value: <Text size="36" font='sans' >Warning notification with some buttons and long long text with blaaaaaa blaaaaaaaaaa</Text>,
                name: 'Long',
            },
        ],
    })
    .prop('actions', {
        examples: [
            {
                value: [
                    {
                        name: 'ACTION 1',
                        action: () => { },
                    },
                ],
                name: '1 action',
            },
            {
                value: [
                    {
                        name: 'ACTION 1',
                        action: () => { },
                    },
                    {
                        name: 'ACTION 2',
                        action: () => { },
                    },
                ],
                name: '2 actions',
            },
        ],
    })
    .prop('onClose', {
        examples: [
            {
                value: () => { },
                name: 'OnClose',
            },
        ],
    })
    .withContexts(DefaultContext);

export default SnackbarCardDoc;
