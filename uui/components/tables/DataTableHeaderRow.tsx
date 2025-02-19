import * as React from 'react';
import { DataTableHeaderRowProps as CoreDataTableHeaderRowProps, withMods } from '@epam/uui-core';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { IconButton } from '../buttons';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { DataTableHeaderGroupCell } from './DataTableHeaderGroupCell';
import type { DataTableHeaderRowMods } from './types';
import { settings } from '../../settings';

import './variables.scss';
import css from './DataTableHeaderRow.module.scss';

export type DataTableHeaderRowProps = CoreDataTableHeaderRowProps & DataTableHeaderRowMods;
export const DataTableHeaderRow = withMods<CoreDataTableHeaderRowProps, DataTableHeaderRowProps>(
    uuiDataTableHeaderRow,
    () => [css.root, 'uui-dt-vars'],
    (mods) => ({
        renderCell: (props) => (
            <DataTableHeaderCell
                { ...props }
                size={ mods.size }
                textCase={ mods.textCase || 'normal' }
                key={ props.column.key }
                columnsGap={ mods.columnsGap }
            />
        ),
        renderGroupCell: (props) => (
            <DataTableHeaderGroupCell
                { ...props }
                size={ mods.size }
                textCase={ mods.textCase || 'normal' }
                key={ props.key }
                columnsGap={ mods.columnsGap }
            />
        ),
        renderConfigButton: () => (
            <IconButton
                key="configuration"
                onClick={ mods.onConfigButtonClick }
                cx={ ['config-icon', `uui-size-${settings.dataTable.sizes.header.cellIconMap[mods.size || settings.dataTable.sizes.header.defaultRow]}`] }
                color="neutral"
                icon={ settings.dataTable.icons.header.configIcon }
            />
        ),
    }),
);
