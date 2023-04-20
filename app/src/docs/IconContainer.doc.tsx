import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3,
} from '../common';

export class IconContainerDoc extends BaseDocsBlock {
    title = 'Icon Container';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/iconContainer.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/iconContainer.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="iconContainer-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/iconContainer/Basic.example.tsx" />
            </>
        );
    }
}
