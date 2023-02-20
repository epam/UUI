import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ResizableContext, iconWithInfoDoc, colorDoc } from '../../docs';
import { Text } from '@epam/promo';
import { AlertProps, Alert } from '@epam/promo';

const SnackbarCardDoc = new DocBuilder<AlertProps>({ name: 'Alert', component: Alert })
    .implements([iconWithInfoDoc, colorDoc])
    .prop('children', {
        examples: [
            {
                value: (
                    <Text size="24" fontSize="14">
                        Notification Text
                    </Text>
                ),
                name: 'Short',
                isDefault: true,
            },
            {
                value: (
                    <Text size="24" fontSize="14">
                        Notification with some buttons and long long text
                    </Text>
                ),
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
                        action: () => {},
                    },
                ],
                name: '1 action',
            },
            {
                value: [
                    {
                        name: 'ACTION 1',
                        action: () => {},
                    },
                    {
                        name: 'ACTION 2',
                        action: () => {},
                    },
                ],
                name: '2 actions',
            },
        ],
    })
    .prop('onClose', {
        examples: [
            {
                value: () => {},
                name: 'OnClose',
            },
        ],
    })
    .withContexts(ResizableContext);

export default SnackbarCardDoc;
