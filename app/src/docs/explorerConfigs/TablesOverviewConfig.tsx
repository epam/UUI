import { TDocConfig, TSkin } from '@epam/uui-docs';
import * as uui from '@epam/uui';

export const tablesOverviewExplorerConfig: TDocConfig = {
    id: 'tablesOverview',
    name: 'DataTable',
    bySkin: {
        [TSkin.UUI]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
        [TSkin.Loveship]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
        [TSkin.Promo]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
        [TSkin.Electric]: { type: '@epam/uui:DataTableProps', component: uui.DataTable },
    },
};
