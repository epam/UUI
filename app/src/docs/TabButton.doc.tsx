import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class TabButtonDoc extends BaseDocsBlock {
    title = 'Tab Button';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/buttons/docs/tabButton.doc.ts',
            [UUI4]: './epam-promo/components/buttons/docs/tabButton.doc.ts',
        };
    }


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='tab-button-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/tabButton/Basic.example.tsx'
                />
            </>
        );
    }
}