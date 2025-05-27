import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { DocItem } from '../documents/structure';

export const flexCellExplorerConfig: TDocConfig = {
    name: 'FlexCell',
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:FlexCellProps', component: uui.FlexCell },
        [TSkin.Electric]: { type: '@epam/uui:FlexCellProps', component: electric.FlexCell },
        [TSkin.Loveship]: { type: '@epam/uui:FlexCellProps', component: loveship.FlexCell },
        [TSkin.Promo]: { type: '@epam/uui:FlexCellProps', component: promo.FlexCell },
    },
    doc: (doc: DocBuilder<uui.FlexCellProps>) => {
        doc.merge('alignSelf', { editorType: 'MultiUnknownEditor', examples: ['flex-start', 'center', 'flex-end'] });
        doc.merge('width', { examples: ['100%', 'auto', { value: 150, isDefault: true }] });
        doc.merge('children', {
            examples: [
                { name: 'Text', value: <uui.Text rawProps={ { style: { width: '100%' } } }>Some text</uui.Text> },
                { name: 'Button', value: <uui.Button color="primary" caption="Submit" rawProps={ { style: { width: '100%' } } } />, isDefault: true },
            ],
        });
    },
};

export const FlexCellDocItem: DocItem = {
    id: 'flexCell',
    name: 'Flex Cell',
    parentId: 'flexItems',
    order: 3,
    examples: [
        { descriptionPath: 'flexCell-description' },
        { componentPath: './_examples/flexItems/FlexCell.example.tsx' },
    ],
    explorerConfig: flexCellExplorerConfig,
};
