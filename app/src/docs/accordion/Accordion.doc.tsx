import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { accordionExamples } from './accordionExamples';
import { IControlled } from '@epam/uui-core';

enum TAccordionPreview {
    Expanded = 'Expanded',
    Collapsed = 'Collapsed'
}

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
            const TEST_DATA = {
                childrenExampleName: 'Simple text 12px - medium length',
                title: 'Title',
                // eslint-disable-next-line
                title2lines: (<>{'Title'}<br/>{'Title'}</>),
                componentWithShortText: () => (<i style={ { margin: '0 6px 0 6px' } }>Test</i>),
            };
            docPreview.add({
                id: TAccordionPreview.Collapsed,
                matrix: {
                    value: { values: [false] },
                    mode: { examples: '*' },
                    renderAdditionalItems: {
                        values: [undefined, TEST_DATA.componentWithShortText],
                    },
                    children: { examples: [TEST_DATA.childrenExampleName] },
                    title: { values: [TEST_DATA.title, TEST_DATA.title2lines] },
                    isDisabled: { examples: '*' },
                },
                cellSize: '160-70',
            });
            docPreview.add({
                id: TAccordionPreview.Expanded,
                matrix: {
                    value: { values: [true] },
                    mode: { examples: '*' },
                    children: { examples: [TEST_DATA.childrenExampleName] },
                    title: { values: [TEST_DATA.title] },
                    isDisabled: { examples: '*' },
                    padding: { examples: '*' },
                },
                cellSize: '280-280',
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
