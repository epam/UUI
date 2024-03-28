import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class SearchInputDoc extends BaseDocsBlock {
    title = 'Search Input';

    static override config: TDocConfig = {
        name: 'SearchInput',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable, TDocContext.Table],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:SearchInputProps', component: uui.SearchInput },
            [TSkin.Loveship]: { type: '@epam/uui:SearchInputProps', component: loveship.SearchInput },
            [TSkin.Promo]: { type: '@epam/uui:SearchInputProps', component: promo.SearchInput },
            [TSkin.Electric]: { type: '@epam/uui:SearchInputProps', component: electric.SearchInput },
        },
        doc: (doc: DocBuilder<uui.SearchInputProps>) => {
            doc.merge('iconPosition', { defaultValue: 'left' });
        },
    };

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
