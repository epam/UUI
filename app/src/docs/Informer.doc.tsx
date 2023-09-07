import * as React from 'react';
import { BaseDocsBlock, EditableDocContent, DocExample, UUI3, UUI4, UUI } from '../common';

export class InformerDoc extends BaseDocsBlock {
    title = 'Informer';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/widgets/informer.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/widgets/informer.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/widgets/informer.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="informer-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/informer/Basic.example.tsx" />
            </>
        );
    }
}
