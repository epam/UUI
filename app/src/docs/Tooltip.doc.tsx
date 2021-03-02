import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class TooltipDoc extends BaseDocsBlock {
    title = 'Tooltip';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/overlays/docs/tooltip.doc.tsx',
            [UUI4]: './epam-promo/components/overlays/docs/tooltip.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='tooltip-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/tooltip/Basic.example.tsx'
                />

                <DocExample
                    title='Custom markup'
                    path='./examples/tooltip/CustomMarkup.example.tsx'
                />

                <DocExample
                    title='Trigger configuration'
                    path='./examples/tooltip/TriggerConfiguration.example.tsx'
                />
            </>
        );
    }
}