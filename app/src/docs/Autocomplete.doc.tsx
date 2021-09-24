import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class AutocompleteDoc extends BaseDocsBlock {
    title = 'Autocomplete';

    getPropsDocPath() {
        return {
            [UUI4]: './epam-promo/components/autocomplete/docs/autocomplete.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='autocomplete-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Autocomplete'
                    path='./examples/autocomplete/Basic.example.tsx'
                />
            </>
        );
    }
}