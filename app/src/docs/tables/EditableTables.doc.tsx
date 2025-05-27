import css from '../styles.module.scss';
import { DocItem } from '../../documents/structure';

export const EditableTablesDocItem: DocItem = {
    id: 'editableTables',
    name: 'Editable',
    parentId: 'tables',
    examples: [
        { descriptionPath: 'editable-tables-descriptions' },
        { name: 'Editable Table', componentPath: './_examples/tables/EditableTable.example.tsx', cx: css.appBg },
        { name: 'Table with copying', componentPath: './_examples/tables/TableWithCopying.example.tsx', cx: css.appBg },
    ],
    order: 2,
    tags: ['tables', 'dataTable'],
};
