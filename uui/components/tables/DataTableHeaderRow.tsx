import * as React from 'react';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { DataTableHeaderRowProps, withMods } from '@epam/uui-core';
import { DataTableHeaderRowMods } from './types';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { IconButton } from '../buttons/IconButton';

import css from './DataTableHeaderRow.module.scss';
import './variables.scss';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/action-settings-18.svg';

export const DataTableHeaderRow = withMods<DataTableHeaderRowProps, DataTableHeaderRowMods>(
    uuiDataTableHeaderRow,
    () => [css.root],
    (mods) => ({
        renderCell: (props) => <DataTableHeaderCell { ...props } size={ mods.size } textCase={ mods.textCase || 'normal' } key={ props.column.key } />,
        renderConfigButton: () => <IconButton key="configuration" onClick={ mods.onConfigButtonClick } cx={ css.configIcon } color="default" icon={ MoreIcon } />,
    }),
);
