import * as React from 'react';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { DataTableHeaderRowProps, withMods } from '@epam/uui-core';
import { DataTableHeaderRowMods } from './types';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { IconButton } from '../buttons';
import { ReactComponent as ConfigIcon } from '@epam/assets/icons/action-settings-fill.svg';
import './variables.scss';
import css from './DataTableHeaderRow.module.scss';

export const DataTableHeaderRow = withMods<DataTableHeaderRowProps, DataTableHeaderRowMods>(
    uuiDataTableHeaderRow,
    (props) => [css.root, 'uui-dt-vars', props.size === '48' && css.truncate],
    (mods) => ({
        renderCell: (props) => <DataTableHeaderCell { ...props } size={ mods.size } textCase={ mods.textCase || 'normal' } key={ props.column.key } columnsGap={ mods.columnsGap } />,
        renderConfigButton: () => <IconButton key="configuration" onClick={ mods.onConfigButtonClick } cx="config-icon" color="neutral" icon={ ConfigIcon } />,
    }),
);
