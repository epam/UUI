import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class VerticalTabButtonDoc extends BaseDocsBlock {
    title = 'Vertical Tab Button';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/buttons/verticalTabButton.doc.ts',
            [UUI4]: './app/src/docProps/epam-promo/components/buttons/verticalTabButton.doc.ts',
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
