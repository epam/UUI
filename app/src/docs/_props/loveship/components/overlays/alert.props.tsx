import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ResizableContext, iconDoc } from '../../docs';
import { Text } from '@epam/loveship';
import { AlertProps, Alert } from '@epam/loveship';
import { colors } from '../../docs/helpers/colorMap';
import { allEpamPrimaryColors } from '@epam/loveship';

const SnackbarCardDoc = new DocBuilder<AlertProps>({ name: 'Alert', component: Alert })
    .implements([iconDoc])
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: allEpamPrimaryColors,
    })
    .prop('children', {
        examples: [
            {
                value: <Text size="30">Notification text</Text>,
                name: 'Short',
                isDefault: true,
            }, {
                value: <Text size="30">Notification with some buttons and long long text </Text>,
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
            }, {
                value: [
                    {
                        name: 'ACTION 1',
                        action: () => {},
                    }, {
                        name: 'ACTION 2',
                        action: () => {},
                    },
                ],
                name: '2 actions',
            },
        ],
    })
    .prop('size', {
        examples: [
            {
                value: '48',
                name: '48',
            }, {
                value: '36',
                name: '36',
            },
        ],
    })
    .prop('onClose', {
        examples: [
            {
                value: () => alert('close action'),
                name: 'OnClose',
            },
        ],
    })
    .withContexts(ResizableContext);

export default SnackbarCardDoc;
