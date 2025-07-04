import css from '../styles.module.scss';
import { TDocConfig, TSkin } from '../../';
import * as uui from '@epam/uui';
import { DocItem } from '../_types/docItem';

export const tablesOverviewExplorerConfig: TDocConfig = {
    name: 'DataTable',
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
        [TSkin.Loveship]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
        [TSkin.Promo]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
        [TSkin.Electric]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
    },
};

export const TablesOverviewDocItem: DocItem = {
    id: 'tablesOverview',
    name: 'Overview',
    parentId: 'tables',
    examples: [
        { descriptionPath: 'tables-overview-descriptions' },
        { name: 'Async Table', componentPath: './_examples/tables/AsyncTable.example.tsx', cx: css.appBg },
        { name: 'Lazy Table', componentPath: './_examples/tables/LazyTable.example.tsx', cx: css.appBg },
        { name: 'Array Table', componentPath: './_examples/tables/ArrayTable.example.tsx', cx: css.appBg },
        { name: 'Tree Table', componentPath: './_examples/tables/TreeTable.example.tsx', cx: css.appBg },
        { name: 'Column size and content align configuration', componentPath: './_examples/tables/StyledColumns.example.tsx', cx: css.appBg },
        { name: 'Condensed view', componentPath: './_examples/tables/CondensedView.example.tsx', cx: css.appBg },
    ],
    explorerConfig: tablesOverviewExplorerConfig,
    order: 1,
    tags: ['tables', 'dataTable'],
};
