import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TSkin } from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class SearchInputDoc extends BaseDocsBlock {
    title = 'Search Input';

    override config: TDocConfig = {
        name: 'SearchInput',
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:SearchInputProps', component: uui.SearchInput },
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:SearchInputProps',
                component: loveship.SearchInput,
                doc: (doc: DocBuilder<loveship.SearchInputProps>) => doc.withContexts(loveshipDocs.FormContext, loveshipDocs.ResizableContext, loveshipDocs.TableContext),
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui:SearchInputProps',
                component: promo.SearchInput,
                doc: (doc: DocBuilder<uui.SearchInputProps>) => doc.withContexts(promoDocs.FormContext, promoDocs.ResizableContext, promoDocs.TableContext),
            },
        },
        doc: (doc: DocBuilder<uui.SearchInputProps | loveship.SearchInputProps>) => {
            doc.merge('type', { renderEditor: 'StringEditor', examples: [] });
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
