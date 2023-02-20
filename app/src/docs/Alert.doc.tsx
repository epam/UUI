import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class AlertDoc extends BaseDocsBlock {
    title = 'Alert';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/overlays/alert.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/overlays/alert.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="alert-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/alert/Basic.example.tsx" />
            </>
        );
    }
}
