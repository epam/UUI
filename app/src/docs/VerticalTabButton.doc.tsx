import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4,
} from '../common';

export class VerticalTabButtonDoc extends BaseDocsBlock {
    title = 'Vertical Tab Button';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/buttons/verticalTabButton.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/buttons/verticalTabButton.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="vertical-tab-button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/verticalTabButton/Basic.example.tsx" />
            </>
        );
    }
}
