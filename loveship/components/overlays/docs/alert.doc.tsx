import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { ResizableContext, iconDoc } from '../../../docs';
import { Text } from '../../typography';
import { AlertProps, Alert } from '..';
import { colors } from "../../../helpers/colorMap";
import { allEpamPrimaryColors } from "../../types";

const SnackbarCardDoc = new DocBuilder<AlertProps>({ name: 'Alert', component: Alert })
    .implements([iconDoc])
    .prop('color', { renderEditor: (editable, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />, examples: allEpamPrimaryColors })
    .prop('children', {
        examples: [
            {
                value: <Text size="24" font='sans' fontSize='14'>Notification text</Text>,
                name: 'Short',
                isDefault: true,
            },
            {
                value: <Text size="24" font='sans' fontSize='14'>Notification with some buttons and long long text </Text>,
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
    .withContexts(ResizableContext);

export default SnackbarCardDoc;
