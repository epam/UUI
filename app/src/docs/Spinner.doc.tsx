import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, TSkin,
} from '../common';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import { TDocConfig } from '../common/docs/docBuilderGen/types';

export class SpinnerDoc extends BaseDocsBlock {
    title = 'Spinner';

    override config: TDocConfig = {
        name: 'Spinner',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:SpinnerProps', component: uui.Spinner },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:SpinnerProps',
                component: loveship.Spinner,
                doc: (doc: DocBuilder<loveship.ButtonProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:SpinnerProps',
                component: promo.Spinner,
                doc: (doc: DocBuilder<promo.ButtonProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext),
            },
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="spinner-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/spinner/Basic.example.tsx" />
            </>
        );
    }
}
