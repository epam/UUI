import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class NumericInputDoc extends BaseDocsBlock {
    title = 'NumericInput';

    static override config: TDocConfig = {
        name: 'NumericInput',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Table, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:NumericInputProps', component: uui.NumericInput },
            [TSkin.Loveship]: { type: '@epam/uui:NumericInputProps', component: loveship.NumericInput },
            [TSkin.Promo]: { type: '@epam/uui:NumericInputProps', component: promo.NumericInput },
            [TSkin.Electric]: { type: '@epam/uui:NumericInputProps', component: electric.NumericInput },
        },
        doc: (doc: DocBuilder<uui.NumericInputProps>) => {
            doc.merge('value', { examples: [{ value: 0, isDefault: true }, 123, 123.99] });
            doc.merge('size', { defaultValue: '36' });
            doc.merge('step', { examples: [5, 10, 100] });
            doc.merge('min', { examples: [-10, 0, 10] });
            doc.merge('max', { examples: [20, 50, 500] });
            doc.merge('mode', { defaultValue: 'form' });
            doc.merge('formatOptions', {
                examples: [
                    { name: 'fraction = 2', value: { minimumFractionDigits: 2, maximumFractionDigits: 2 } },
                    { name: 'fraction <= 2', value: { maximumFractionDigits: 2 } },
                    { name: 'fraction >= 2', value: { minimumFractionDigits: 2 } },
                ],
                editorType: 'JsonEditor',
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
