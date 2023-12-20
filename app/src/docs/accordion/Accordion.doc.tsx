import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { accordionExamples } from './accordionExamples';

export class AccordionDoc extends BaseDocsBlock {
    title = 'Accordion';

    override config: TDocConfig = {
        name: 'Accordion',
        contexts: [TDocContext.Resizable],
        bySkin: {
            [TSkin.Loveship]: { type: '@epam/uui:AccordionProps', component: loveship.Accordion },
            [TSkin.Promo]: { type: '@epam/uui:AccordionProps', component: promo.Accordion },
            [TSkin.UUI]: { type: '@epam/uui:AccordionProps', component: uui.Accordion },
            [TSkin.Electric]: { type: '@epam/uui:AccordionProps', component: electric.Accordion },
        },
        doc: (doc: DocBuilder<uui.AccordionProps>) => {
            doc.merge('children', { examples: accordionExamples });
            doc.merge('title', { examples: [{ value: 'Accordion title', isDefault: true }, 'Additional info'] });
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
