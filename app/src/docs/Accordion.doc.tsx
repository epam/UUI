import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class AccordionDoc extends BaseDocsBlock {
    title = 'Accordion';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/layout/accordion.doc.tsx',
            [UUI4]: './app/src/docProps/epam-promo/components/layout/accordion.doc.tsx',
        };
    }


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='accordion-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/accordion/Basic.example.tsx'
                />
                <DocExample
                    title='Handle Accordion state by yourself'
                    path='./examples/accordion/HandleStateByYourself.example.tsx'
                />
                <DocExample
                    title='Custom accordion'
                    path='./examples/accordion/Custom.example.tsx'
                />
            </>
        );
    }
}
