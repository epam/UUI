import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class SearchInputDoc extends BaseDocsBlock {
    title = 'Search Input';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/docs/searchInput.doc.ts',
            [UUI4]: './epam-promo/components/inputs/docs/searchInput.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='searchInput-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Debounce'
                    path='./examples/searchInput/Debounce.example.tsx'
                />
            </>
        );
    }
}