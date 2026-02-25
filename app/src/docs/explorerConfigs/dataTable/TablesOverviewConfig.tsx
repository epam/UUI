import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import * as uui from '@epam/uui';
import {
    tableOverviewColumnsExample,
    tableOverviewColumnsGroupsExample,
    tableOverviewDataTableFocusManagerExample,
    tableOverviewFiltersExample,
    tableOverviewGetRowsExample,
    tableOverviewRowsExample,
    tableOverviewSelectAllExample,
    tableOverviewValueExample,
} from './tableOverviewExamples';

export const TablesOverviewExplorerConfig: TDocConfig = {
    id: 'tablesOverview',
    name: 'DataTable',
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
        [TSkin.Loveship]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
        [TSkin.Promo]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
        [TSkin.Electric]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
    },
    doc: (doc: DocBuilder<uui.DataTableProps<any, any>>) => {
        doc.merge('columns', { examples: tableOverviewColumnsExample });
        doc.merge('rows', { examples: tableOverviewRowsExample });
        doc.merge('getRows', { examples: tableOverviewGetRowsExample });
        doc.merge('columnGroups', { examples: tableOverviewColumnsGroupsExample });
        doc.merge('selectAll', { examples: tableOverviewSelectAllExample });
        doc.merge('filters', { examples: tableOverviewFiltersExample });
        doc.merge('value', { isRequired: false, examples: tableOverviewValueExample, editorType: 'JsonEditor' });
        doc.merge('dataTableFocusManager', { examples: tableOverviewDataTableFocusManagerExample });
    },
};
