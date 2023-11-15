import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { EditableDocContent, DocExample, BaseDocsBlock, TSkin } from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';

export class TextAreaDoc extends BaseDocsBlock {
    title = 'TextArea';

    override config: TDocConfig = {
        name: 'TextArea',
        bySkin: {
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:TextAreaProps',
                component: loveship.TextArea,
                doc: (doc: DocBuilder<uui.TextAreaProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext, loveshipDocs.TableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:TextAreaProps',
                component: promo.TextArea,
                doc: (doc: DocBuilder<uui.TextAreaProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext, loveshipDocs.TableContext),
            },
            [TSkin.UUI]: {
                type: '@epam/uui:TextAreaProps',
                component: uui.TextArea,
            },
        },
        doc: (doc: DocBuilder<uui.TextAreaProps>) => {
            doc.merge('mode', { defaultValue: 'form' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textArea-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textArea/Basic.example.tsx" />
                <DocExample title="Advanced" path="./_examples/textArea/Advanced.example.tsx" />
            </>
        );
    }
}
