import * as React from 'react';
import { BaseDocsBlock, EditableDocContent, DocExample, UUI3, UUI4, UUI } from '../common';

export class StatusIndicatorDoc extends BaseDocsBlock {
    title = 'StatusIndicator';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/widgets/statusIndicator.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/widgets/statusIndicator.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/widgets/statusIndicator.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                {this.renderSectionTitle('Examples')}
                <EditableDocContent fileName="statusIndicator-descriptions" />
                <DocExample title="Sizes example" path="./_examples/statusIndicator/Sizes.example.tsx" />
                <DocExample title="Fill & Colors example" path="./_examples/statusIndicator/Basic.example.tsx" />
                <DocExample title="Uses in Table example" path="./_examples/statusIndicator/WithTable.example.tsx" />
                <DocExample title="Dropdown example" path="./_examples/statusIndicator/Dropdown.example.tsx" />
            </>
        );
    }
}
