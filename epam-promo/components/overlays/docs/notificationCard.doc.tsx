import React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { DefaultContext, iconWithInfoDoc } from '../../../docs';
import { Text } from '../../typography';
import { NotificationCard, NotificationCardProps } from '../NotificationCard';
import { colors } from '../../../helpers/colorMap';
import { allEpamPrimaryColors } from '../../types';

const SnackbarCardDoc = new DocBuilder<NotificationCardProps>({ name: 'NotificationCard', component: NotificationCard })
    .implements([iconWithInfoDoc] as any)
    .prop('color', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />, examples: [...allEpamPrimaryColors, 'gray60'] })
    .prop('children', {
        examples: [
            {
                value: <Text size="36" font='sans' fontSize='14'>Warning notification</Text>,
                name: 'Short',
            },
            {
                value: <Text size="36" font='sans' fontSize='14'>Warning notification with some buttons and long long text with blaaaaaa blaaaaaaaaaa</Text>,
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

export = SnackbarCardDoc;
