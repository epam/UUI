import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class TagDoc extends BaseDocsBlock {
    title = 'Tag';

    override config: TDocConfig = {
        name: 'Tag',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TagProps', component: uui.Tag },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:TagProps',
                component: loveship.Tag,
                doc: (doc: DocBuilder<loveship.TagProps>) => {
                    doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext);
                    doc.merge('size', { defaultValue: '18' });
                },
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:TagProps',
                component: promo.Tag,
                doc: (doc: DocBuilder<uui.TagProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
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
            </>
        );
    }
}
