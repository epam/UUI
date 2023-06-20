import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4,
} from '../common';

export class SearchInputDoc extends BaseDocsBlock {
    title = 'Search Input';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/searchInput.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/searchInput.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="searchInput-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Debounce" path="./_examples/searchInput/Debounce.example.tsx" />
            </>
        );
    }
}
