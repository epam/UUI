import { DataTableScrollRow as uuiDataTableScrollRow, DataTableScrollRowProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { ScrollRowMods } from './types';
import * as css from './DataTableScrollRow.scss';

export const DataTableScrollRow = withMods<DataTableScrollRowProps, ScrollRowMods>(
    uuiDataTableScrollRow,
    (mods: ScrollRowMods) => ({
        cellClass: css.cell,
    }),
);
