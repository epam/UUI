import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3, TDocsGenType,
} from '../common';

export class AccordionDoc extends BaseDocsBlock {
    title = 'Accordion';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:AccordionProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/accordion.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/accordion.props.tsx',
        };
    }

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
