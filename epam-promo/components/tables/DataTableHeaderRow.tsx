import * as React from 'react';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { DataTableHeaderRowProps, withMods, DataTableHeaderCellProps } from '@epam/uui';
import { IconButton, DataTableHeaderCell, DataTableHeaderRowMods } from '../';
import * as css from './DataTableHeaderRow.scss';
import * as moreIcon from '@epam/assets/icons/common/action-settings-18.svg';

export const DataTableHeaderRow = withMods<DataTableHeaderRowProps<any, any>, DataTableHeaderRowMods>(
    uuiDataTableHeaderRow,
    (mods: DataTableHeaderRowMods) => [
        css.root,
    ],
    (mods: DataTableHeaderRowMods & DataTableHeaderRowProps<any, any>) => ({
        renderCell: (props: DataTableHeaderCellProps<any, any>) => <DataTableHeaderCell
            key={ props.column.key }
            { ...props }
            size={ mods.size }
            textCase={ mods.textCase || 'normal' }
        />,
        renderConfigButton: () => <IconButton key='configuration' onClick={ mods.onConfigButtonClick } cx={ css.configIcon } color='gray60' icon={ moreIcon } />,
    }));