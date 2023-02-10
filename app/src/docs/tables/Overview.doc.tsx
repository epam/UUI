import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class TablesOverviewDoc extends BaseDocsBlock {
    title = 'Tables overview';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='tables-overview-descriptions' />
                { this.renderSectionTitle('Examples') }

                <DocExample
                    title='Async Table'
                    path='./_examples/tables/AsyncTable.example.tsx'
                />

                <DocExample
                    title='Lazy Table'
                    path='./_examples/tables/LazyTable.example.tsx'
                />

                <DocExample
                    title='Array Table'
                    path='./_examples/tables/ArrayTable.example.tsx'
                />

                <DocExample
                    title='Tree Table'
                    path='./_examples/tables/TreeTable.example.tsx'
                />

                <DocExample
                    title='Column size and content align configuration'
                    path='./_examples/tables/StyledColumns.example.tsx'
                />
            </>
        );
    }
}
