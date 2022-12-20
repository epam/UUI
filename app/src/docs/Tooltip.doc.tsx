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
                { this.renderSectionTitle('Overview') }
                <DocExample
                    title='Types'
                    path='./examples/tooltip/Types.example.tsx'
                />

                <DocExample
                    title='Variants (Styles)'
                    path='./examples/tooltip/Variants.example.tsx'
                />

                <DocExample
                    title='Tooltip placement'
                    path='./examples/tooltip/Placement.example.tsx'
                />

                <DocExample
                    title='Custom markup'
                    path='./examples/tooltip/CustomMarkup.example.tsx'
                />

                <DocExample
                    title='Trigger configuration'
                    path='./examples/tooltip/TriggerConfiguration.example.tsx'
                />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Tooltip with icon'
                    path='./examples/tooltip/WithIcon.example.tsx'
                />
            </>
        );
    }
}