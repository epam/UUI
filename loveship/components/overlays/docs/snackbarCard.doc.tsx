import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { SnackbarCard, SnackbarCardProps } from '../SnackbarCard';
import { DefaultContext } from '../../../docs';
import { LinkButton } from '../../buttons';
import { FlexRow } from '../../layout';
import { Text } from '../../typography';

const SnackbarCardDoc = new DocBuilder<SnackbarCardProps>({ name: 'SnackbarCard', component: SnackbarCard as React.ComponentClass<any> })
    .prop('snackType', {
        examples: [
            { value: 'success' },
            { value: 'warning' },
            { value: 'info' },
            { value: 'danger' },
        ],
        defaultValue: 'success',
        isRequired: true,
    })
    .prop('children', {
        examples: [
            {
                value: <><FlexRow padding='24' vPadding='12'>
                    <Text size="30" font='sans'>Warning notification with some buttons</Text>
                </FlexRow>
                <FlexRow padding='24' vPadding='12'>
                    <LinkButton caption='CANCEL CHANGES' size='30' />
                </FlexRow>
                </>, name: 'Base',
            },
        ],
    })
    .withContexts(DefaultContext);

export = SnackbarCardDoc;