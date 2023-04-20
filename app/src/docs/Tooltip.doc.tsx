import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI } from '../common';

export class TooltipDoc extends BaseDocsBlock {
    title = 'Tooltip';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/overlays/tooltip.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/overlays/tooltip.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/overlays/tooltip.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tooltip-descriptions" />
                {this.renderSectionTitle('Overview')}
                <DocExample title="Types" path="./_examples/tooltip/Types.example.tsx" />

                <DocExample title="Variants (Styles)" path="./_examples/tooltip/Variants.example.tsx" />

                <DocExample title="Tooltip placement" path="./_examples/tooltip/Placement.example.tsx" />

                <DocExample title="Custom markup" path="./_examples/tooltip/CustomMarkup.example.tsx" />

                {this.renderSectionTitle('Examples')}
                <DocExample title="Tooltip with delay" path="./_examples/tooltip/Delay.example.tsx" />
                <DocExample title="Tooltip with icon" path="./_examples/tooltip/WithIcon.example.tsx" />
                <DocExample title="Tooltip with a link" path="./_examples/tooltip/WithLink.example.tsx" />
            </>
        );
    }
}
