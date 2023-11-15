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

export class TextInputDoc extends BaseDocsBlock {
    title = 'Text Input';

    override config: TDocConfig = {
        name: 'TextInput',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:TextInputProps', component: uui.TextInput },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:TextInputProps',
                component: loveship.TextInput,
                doc: (doc: DocBuilder<loveship.TextInputProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext, loveshipDocs.TableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:TextInputProps',
                component: promo.TextInput,
                doc: (doc: DocBuilder<uui.TextInputProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext, promoDocs.TableContext),
            },
        },
        doc: (doc: DocBuilder<uui.TextInputProps | loveship.TextInputProps>) => {
            doc.merge('type', { examples: ['text', 'password'], type: 'string', defaultValue: 'text' });
            doc.merge('mode', { defaultValue: 'form' });
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textInput/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/textInput/Size.example.tsx" />
                <DocExample title="Action" path="./_examples/textInput/Action.example.tsx" />
            </>
        );
    }
}
