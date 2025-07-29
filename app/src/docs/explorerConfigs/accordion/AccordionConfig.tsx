import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, DocPreviewBuilder, TDocConfig, TDocContext, TSkin, TAccordionPreview } from '@epam/uui-docs';
import { accordionExamples } from './accordionExamples';
import { IControlled } from '@epam/uui-core';

export const AccordionConfig: TDocConfig = {
    id: 'accordion',
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
            componentWithShortText: () => (
                <>
                    <uui.FlexSpacer />
                    <i>Side</i>
                </>
            ),
        };
        docPreview.add({
            id: TAccordionPreview['All Variants Collapsed'],
            matrix: {
                isDisabled: { values: [false, true] },
                value: { values: [false] },
                mode: { examples: '*' },
                renderAdditionalItems: {
                    values: [undefined, TEST_DATA.componentWithShortText],
                },
                children: { examples: [TEST_DATA.childrenExampleName] },
                title: { values: [TEST_DATA.title] },
            },
            context: TDocContext.Block,
            cellSize: '160-70',
        });
        docPreview.add({
            id: TAccordionPreview['All Variants Expanded'],
            matrix: {
                isDisabled: { values: [false, true] },
                value: { values: [true] },
                mode: { examples: '*' },
                children: { examples: [TEST_DATA.childrenExampleName] },
                title: { values: [TEST_DATA.title] },
                padding: { examples: '*' },
            },
            context: TDocContext.Block,
            cellSize: '280-190',
        });
    },
};
