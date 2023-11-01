import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI, TDocsGenType,
} from '../common';

export class SearchInputDoc extends BaseDocsBlock {
    title = 'Search Input';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:SearchInputProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/searchInput.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/searchInput.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/inputs/searchInput.props.ts',
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
