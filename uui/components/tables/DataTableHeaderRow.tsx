import * as React from 'react';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { DataTableHeaderRowProps, withMods } from '@epam/uui-core';
import { IconButton, DataTableHeaderCell, DataTableHeaderRowMods } from '../';
import css from './DataTableHeaderRow.scss';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/action-settings-18.svg';

export const DataTableHeaderRow = withMods<DataTableHeaderRowProps, DataTableHeaderRowMods>(
    uuiDataTableHeaderRow,
    (mods) => [css.root],
    (mods) => ({
        renderCell: (props) => <DataTableHeaderCell { ...props } size={ mods.size } textCase={ mods.textCase || 'normal' } key={ props.column.key } />,
        renderConfigButton: () => <IconButton key="configuration" onClick={ mods.onConfigButtonClick } cx={ css.configIcon } color="default" icon={ MoreIcon } />,
    }),
);
