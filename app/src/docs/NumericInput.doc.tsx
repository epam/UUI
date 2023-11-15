import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class NumericInputDoc extends BaseDocsBlock {
    title = 'NumericInput';

    override config: TDocConfig = {
        name: 'NumericInput',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:NumericInputProps', component: uui.NumericInput },
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui:NumericInputProps',
                component: loveship.NumericInput,
                doc: (doc: DocBuilder<uui.NumericInputProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext, loveshipDocs.TableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:NumericInputProps',
                component: promo.NumericInput,
                doc: (doc: DocBuilder<uui.NumericInputProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext, promoDocs.TableContext),
            },
        },
        doc: (doc: DocBuilder<uui.NumericInputProps>) => {
            doc.merge('value', { examples: [{ value: 0, isDefault: true }] });
            doc.merge('size', { defaultValue: '36' });
            doc.merge('mode', { defaultValue: 'form' });
            doc.merge('formatOptions', {
                examples: [
                    { name: '{ minimumFractionDigits: 2, maximumFractionDigits: 2 }', value: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
                    { name: '{ maximumFractionDigits: 2 }', value: { maximumFractionDigits: 2 } },
                    { name: '{ minimumFractionDigits: 2 }', value: { minimumFractionDigits: 2 } },
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="numericInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/numericInput/Basic.example.tsx" />
                <DocExample title="Formatting options" path="./_examples/numericInput/Formatting.example.tsx" />
                <DocExample title="Size" path="./_examples/numericInput/Size.example.tsx" />
            </>
        );
    }
}
