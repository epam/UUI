import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common/docs';

export class FlexCellDoc extends BaseDocsBlock {
    title = 'FlexCell';

    override config: TDocConfig = {
        name: 'FlexCell',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:FlexCellProps', component: uui.FlexCell },
            [TSkin.UUI3_loveship]: { type: '@epam/uui:FlexCellProps', component: loveship.FlexCell },
            [TSkin.UUI4_promo]: { type: '@epam/uui:FlexCellProps', component: promo.FlexCell },
        },
        doc: (doc: DocBuilder<uui.FlexCellProps>) => {
            doc.merge('alignSelf', { renderEditor: 'MultiUnknownEditor', examples: ['flex-start', 'center', 'flex-end'] });
            doc.merge('width', { examples: ['100%', 'auto', { value: 150, isDefault: true }] });
            doc.merge('children', {
                examples: [
                    { name: 'Text', value: <uui.Text rawProps={ { style: { width: '100%' } } }>Some text</uui.Text> },
                    { name: 'Button', value: <uui.Button color="primary" caption="Submit" rawProps={ { style: { width: '100%' } } } />, isDefault: true },
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="flexCell-description" />
                {this.renderSectionTitle('Examples')}
                <DocExample path="./_examples/flexItems/FlexCell.example.tsx" />
            </>
        );
    }
}
