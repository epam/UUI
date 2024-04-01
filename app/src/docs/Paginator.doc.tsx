import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import * as uuiComponents from '@epam/uui-components';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class PaginatorDoc extends BaseDocsBlock {
    title = 'Paginator';

    static override config: TDocConfig = {
        name: 'Paginator',
        contexts: [TDocContext.Default, TDocContext.PagePanel],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:PaginatorProps', component: uui.Paginator },
            [TSkin.Loveship]: { type: '@epam/uui-components:PaginatorProps', component: loveship.Paginator },
            [TSkin.Promo]: { type: '@epam/uui-components:PaginatorProps', component: promo.Paginator },
            [TSkin.Electric]: { type: '@epam/uui-components:PaginatorProps', component: electric.Paginator },
        },
        doc: (doc: DocBuilder<uuiComponents.PaginatorProps>) => {
            doc.merge('totalPages', { examples: [5, 8, { value: 10, isDefault: true }, 100, 1000] });
            doc.merge('value', { examples: [1, { value: 5, isDefault: true }, 6, 8], editorType: 'NumEditor' });
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
