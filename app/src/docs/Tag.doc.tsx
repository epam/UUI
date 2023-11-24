import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class TagDoc extends BaseDocsBlock {
    title = 'Tag';

    override config: TDocConfig = {
        name: 'Tag',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TagProps', component: uui.Tag },
            [TSkin.UUI4_promo]: { type: '@epam/uui:TagProps', component: promo.Tag },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:TagProps',
                component: loveship.Tag,
                doc: (doc: DocBuilder<loveship.TagProps>) => {
                    doc.merge('size', { defaultValue: '18' });
                },
            },
        },
        doc: (doc: DocBuilder<loveship.TagProps | uui.TagProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tag-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/tag/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/tag/Size.example.tsx" />
                <DocExample title="Color variants" path="./_examples/tag/Colors.example.tsx" />
            </>
        );
    }
}
