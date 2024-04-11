import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { accordionExamples } from './accordionExamples';
import { IControlled } from '@epam/uui-core';

export class AccordionDoc extends BaseDocsBlock {
    title = 'Accordion';

    static override config: TDocConfig = {
        name: 'Accordion',
        contexts: [TDocContext.Resizable],
        bySkin: {
            [TSkin.Loveship]: { type: '@epam/uui:AccordionProps', component: loveship.Accordion },
            [TSkin.Promo]: { type: '@epam/uui:AccordionProps', component: promo.Accordion },
            [TSkin.UUI]: { type: '@epam/uui:AccordionProps', component: uui.Accordion },
            [TSkin.Electric]: { type: '@epam/uui:AccordionProps', component: electric.Accordion },
        },
        doc: (doc: DocBuilder<uui.AccordionProps & IControlled<boolean>>) => {
            doc.merge('children', { examples: accordionExamples });
            doc.merge('title', { examples: [{ value: 'Accordion title', isDefault: true }, 'Additional info'] });
            doc.merge('value', { isRequired: false });
            doc.merge('onValueChange', { isRequired: false });
        },
        preview: (docPreview: DocPreviewBuilder<uui.AccordionProps & IControlled<boolean>>) => {
            docPreview.add({
                id: 'Headers',
                matrix: {
                    value: { values: [false] },
                    children: { examples: ['Simple text 12px'] },
                    title: { values: ['Accordion title', '2 line accordion title with more text'] },
                    mode: { examples: ['block', 'inline'] },
                    isDisabled: { values: [true, false] },
                    renderAdditionalItems: { examples: [
                        'Component with short text',
                        undefined,
                    ] },
                },
                cellSize: '280-70',
                context: TDocContext.Resizable,
            });
            docPreview.add({
                id: 'Unfolded body',
                matrix: {
                    value: { values: [true] },
                    children: { examples: ['Simple text 12px'] },
                    title: { values: ['Accordion title'] },
                    mode: { examples: ['block', 'inline'] },
                    isDisabled: { values: [true, false] },
                    padding: { examples: '*' },
                },
                cellSize: '280-280',
                context: TDocContext.Resizable,
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="accordion-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/accordion/Basic.example.tsx" />
                <DocExample title="Handle Accordion state by yourself" path="./_examples/accordion/HandleStateByYourself.example.tsx" />
                <DocExample title="Custom accordion" path="./_examples/accordion/Custom.example.tsx" />
            </>
        );
    }
}
