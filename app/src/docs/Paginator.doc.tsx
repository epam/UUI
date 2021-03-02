import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class PaginatorDoc extends BaseDocsBlock {
    title = 'Paginator';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/widgets/docs/paginator.doc.tsx',
            [UUI4]: './epam-promo/components/widgets/docs/paginator.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='paginator-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/paginator/Basic.example.tsx'
                />
            </>
        );
    }
}