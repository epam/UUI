import { DataTableScrollRow as uuiDataTableScrollRow, DataTableScrollRowProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as css from './DataTableScrollRow.scss';
import { ScrollRowMods } from './types';

export const DataTableScrollRow = withMods<DataTableScrollRowProps, ScrollRowMods>(
    uuiDataTableScrollRow,
    (mods: ScrollRowMods) => ({
        cellClass: css.cell,
    }),
);
