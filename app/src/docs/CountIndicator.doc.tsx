import * as React from 'react';
import { BaseDocsBlock, EditableDocContent, DocExample, UUI3, UUI4, UUI } from '../common';

export class CountIndicatorDoc extends BaseDocsBlock {
    title = 'CountIndicator';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/widgets/countIndicator.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/widgets/countIndicator.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/widgets/countIndicator.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="countIndicator-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/countIndicator/Basic.example.tsx" />
            </>
        );
    }
}
