import css from '../styles.module.scss';
import { DocItem } from '../_types/docItem';

export const AdvancedTablesDocItem: DocItem = {
    id: 'advancedTables',
    name: 'Advanced',
    parentId: 'tables',
    examples: [
        { descriptionPath: 'advanced-tables-descriptions' },
        { name: 'Collapse/expand All', componentPath: './_examples/tables/TableCollapse.example.tsx', cx: css.appBg },
        { name: 'Columns Configuration', componentPath: './_examples/tables/ColumnsConfig.example.tsx', cx: css.appBg },
        { name: 'Table with paging and select page', componentPath: './_examples/tables/PagedTable.example.tsx', cx: css.appBg },
        { name: 'Table with paging and select all rows', componentPath: './_examples/tables/PagedTableWithSelectAll.example.tsx', cx: css.appBg },
        { name: 'Table with column filters', componentPath: './_examples/tables/ColumnFiltersTable.example.tsx', cx: css.appBg },
        { name: 'Table with pinned rows', componentPath: './_examples/tables/TableWithPinnedRows.example.tsx', cx: css.appBg },
        { name: 'Table with expandable rows', componentPath: './_examples/tables/TableWithExpandableRows.example.tsx', cx: css.appBg },
        { name: 'Table with rows Drag&Drop', componentPath: './_examples/tables/TableWithDnD.example.tsx', cx: css.appBg },
        { name: 'Table with header groups', componentPath: './_examples/tables/TableGroupedHeader.example.tsx', cx: css.appBg },
    ],
    order: 3,
    tags: ['tables', 'dataTable'],
};
