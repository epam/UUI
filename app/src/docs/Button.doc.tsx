import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as loveshipDocs from './_props/loveship/docs';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { BaseDocsBlock, DocExample, EditableDocContent, TSkin } from '../common';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class ButtonDoc extends BaseDocsBlock {
    title = 'Button';

    override config: TDocConfig = {
        name: 'Button',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:ButtonProps', component: uui.Button },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:ButtonProps',
                component: loveship.Button,
                doc: (doc: DocBuilder<loveship.ButtonProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:ButtonProps',
                component: promo.Button,
                doc: (doc: DocBuilder<promo.ButtonProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
        doc: (doc: DocBuilder<promo.ButtonProps | loveship.ButtonProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/button/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/button/Size.example.tsx" />
                <DocExample title="Styles" path="./_examples/button/Styling.example.tsx" />
                <DocExample title="Button with Icon" path="./_examples/button/Icon.example.tsx" />
                <DocExample title="Button with link" path="./_examples/button/Link.example.tsx" />
                <DocExample title="Button as a Toggler" path="./_examples/button/Toggler.example.tsx" />
            </>
        );
    }
}
