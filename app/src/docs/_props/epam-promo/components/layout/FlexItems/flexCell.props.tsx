import * as React from 'react';
import {
    RowMods, Button, Text, FlexCell,
} from '@epam/promo';
import { FlexCellProps } from '@epam/uui-core';
import { DocBuilder } from '@epam/uui-docs';
import { FlexRowContext, onClickDoc } from '../../../docs';

const flexCellDoc = new DocBuilder<FlexCellProps & RowMods>({ name: 'FlexCell', component: FlexCell })
    .implements([onClickDoc])
    .prop('children', {
        examples: [
            {
                name: 'Text',
                value: <Text rawProps={ { style: { width: '100%' } } }>Some text</Text>,
            },
            {
                name: 'Button',
                value: <Button color="green" caption="Submit" rawProps={ { style: { width: '100%' } } } />,
                isDefault: true,
            },
        ],
    })
    .prop('width', {
        examples: [
            '100%',
            'auto',
            { value: 150, isDefault: true },
        ],
    })
    .prop('minWidth', {
        examples: [
            100,
            200,
            300,
        ],
    })
    .prop('grow', {
        examples: [
            { value: 1, isDefault: true },
            2,
            3,
        ],
    })
    .prop('shrink', { examples: [0, 1] })
    .prop('alignSelf', {
        examples: [
            'flex-start',
            'center',
            'flex-end',
        ],
    })
    .prop('textAlign', {
        examples: [
            'left',
            'center',
            'right',
        ],
    })
    .withContexts(FlexRowContext);

export default flexCellDoc;
