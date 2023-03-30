import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class EditableTablesDoc extends BaseDocsBlock {
    title = 'Editable Tables';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='editable-tables-descriptions' />
                { this.renderSectionTitle('Examples') }

                <DocExample
                    title='Editable Table'
                    path='./_examples/tables/EditableTable.example.tsx'
                />

                <DocExample
                    title='Table with copying'
                    path='./_examples/tables/TableWithCopying.example.tsx'
                />
            </>
        );
    }
}
