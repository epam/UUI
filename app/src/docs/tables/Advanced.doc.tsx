import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class AdvancedTablesDoc extends BaseDocsBlock {
    title = 'Advanced Tables';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="advanced-tables-descriptions" />
                {this.renderSectionTitle('Examples')}

                <DocExample title="Columns Configuration" path="./_examples/tables/ColumnsConfig.example.tsx" />

                <DocExample title="Table with rows Drag&Drop" path="./_examples/tables/TableWithDnD.example.tsx" />

                <DocExample title="Table with paging" path="./_examples/tables/PagedTable.example.tsx" />
            </>
        );
    }
}
