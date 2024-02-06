import * as React from 'react';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { DataTableHeaderRowProps, withMods } from '@epam/uui-core';
import { DataTableHeaderRowMods } from './types';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { IconButton } from '../buttons';
import { ReactComponent as ConfigIcon } from '../../icons/action-settings-24.svg';
import './variables.scss';
import css from './DataTableHeaderRow.module.scss';

export const DataTableHeaderRow = withMods<DataTableHeaderRowProps, DataTableHeaderRowMods>(
    uuiDataTableHeaderRow,
    () => [css.root, 'uui-dt-vars'],
    (mods) => ({
        renderCell: (props) => <DataTableHeaderCell { ...props } size={ mods.size } textCase={ mods.textCase || 'normal' } key={ props.column.key } />,
        renderConfigButton: () => <IconButton key="configuration" onClick={ mods.onConfigButtonClick } cx="config-icon" color="neutral" icon={ ConfigIcon } />,
    }),
);
