import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';
import css from '../styles.module.scss';

export class AdvancedTablesDoc extends BaseDocsBlock {
    title = 'Advanced Tables';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="advanced-tables-descriptions" />
                {this.renderSectionTitle('Examples')}

                <DocExample cx={ css.appBg } title="Collapse/expand All" path="./_examples/tables/TableCollapse.example.tsx" />

                <DocExample cx={ css.appBg } title="Columns Configuration" path="./_examples/tables/ColumnsConfig.example.tsx" />

                <DocExample cx={ css.appBg } title="Table with paging and select page" path="./_examples/tables/PagedTable.example.tsx" />
                <DocExample cx={ css.appBg } title="Table with paging and select all rows" path="./_examples/tables/PagedTableWithSelectAll.example.tsx" />

                <DocExample cx={ css.appBg } title="Table with column filters" path="./_examples/tables/ColumnFiltersTable.example.tsx" />
                
                <DocExample cx={ css.appBg } title="Table with pinned rows" path="./_examples/tables/TableWithPinnedRows.example.tsx" />
                <DocExample cx={ css.appBg } title="Table with expandable rows" path="./_examples/tables/TableWithExpandableRows.example.tsx" />

                <DocExample cx={ css.appBg } title="Table with rows Drag&Drop" path="./_examples/tables/TableWithDnD.example.tsx" />

                <DocExample cx={ css.appBg } title="Table with header groups" path="./_examples/tables/TableGroupedHeader.example.tsx" />
            </>
        );
    }
}
