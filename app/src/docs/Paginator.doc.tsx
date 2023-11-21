import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uuiComponents from '@epam/uui-components';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class PaginatorDoc extends BaseDocsBlock {
    title = 'Paginator';

    override config: TDocConfig = {
        name: 'Paginator',
        contexts: [TDocContext.Default, TDocContext.PagePanel],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:PaginatorProps', component: uui.Paginator },
            [TSkin.UUI3_loveship]: { type: '@epam/uui-components:PaginatorProps', component: loveship.Paginator },
            [TSkin.UUI4_promo]: { type: '@epam/uui-components:PaginatorProps', component: promo.Paginator },
        },
        doc: (doc: DocBuilder<uuiComponents.PaginatorProps>) => {
            doc.merge('totalPages', { examples: [{ value: 10, isDefault: true }] });
            doc.merge('value', { examples: [{ value: 5, isDefault: true }] });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="paginator-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/paginator/Basic.example.tsx" />
            </>
        );
    }
}
