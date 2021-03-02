import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class TablesDoc extends BaseDocsBlock {
    title = 'Tables';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='tables-descriptions' />
                { this.renderSectionTitle('Examples') }

                <DocExample
                    title='Async Table'
                    path='./examples/tables/AsyncTable.example.tsx'
                />

                <DocExample
                    title='Lazy Table'
                    path='./examples/tables/LazyTable.example.tsx'
                />

                <DocExample
                    title='Array Table'
                    path='./examples/tables/ArrayTable.example.tsx'
                />

                <DocExample
                    title='Tree Table'
                    path='./examples/tables/TreeTable.example.tsx'
                />
            </>
        );
    }
}
