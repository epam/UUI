import * as React from 'react';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { DataTableHeaderRowProps as CoreDataTableHeaderRowProps, withMods } from '@epam/uui-core';
import { DataTableHeaderRowMods } from './types';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { IconButton } from '../buttons';
import { ReactComponent as ConfigIcon } from '@epam/assets/icons/action-settings-fill.svg';
import { settings } from '../../settings';

import './variables.scss';
import css from './DataTableHeaderRow.module.scss';

export type DataTableHeaderRowProps = CoreDataTableHeaderRowProps & DataTableHeaderRowMods;
export const DataTableHeaderRow = withMods<CoreDataTableHeaderRowProps, DataTableHeaderRowProps>(
    uuiDataTableHeaderRow,
    (props) => [css.root, 'uui-dt-vars', settings.sizes.dataTableHeaderRow.truncate.includes(props.size) && css.truncate],
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
        renderConfigButton: () => (
            <IconButton
                key="configuration"
                onClick={ mods.onConfigButtonClick }
                cx={ ['config-icon', `uui-size-${settings.sizes.dataTableHeaderRow.iconSize[mods.size || settings.sizes.defaults.dataTableHeaderRow]}`] }
                color="neutral"
                icon={ ConfigIcon }
            />
        ),
    }),
);
