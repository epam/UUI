import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '../';
import { DocItem } from './_types/docItem';

export const searchInputExplorerConfig: TDocConfig = {
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

export const SearchInputDocItem: DocItem = {
    id: 'searchInput',
    name: 'Search Input',
    parentId: 'components',
    examples: [
        { descriptionPath: 'searchInput-descriptions' },
        { name: 'Debounce', componentPath: './_examples/searchInput/Debounce.example.tsx' },
    ],
    explorerConfig: searchInputExplorerConfig,
};
