import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class VerticalTabButtonDoc extends BaseDocsBlock {
    title = 'Vertical Tab Button';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/buttons/docs/verticalTabButton.doc.ts',
            [UUI4]: './epam-promo/components/buttons/docs/verticalTabButton.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='vertical-tab-button-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/verticalTabButton/Basic.example.tsx'
                />
            </>
        );
    }
}