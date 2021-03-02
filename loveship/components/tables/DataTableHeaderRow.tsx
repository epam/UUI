import React from 'react';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { DataTableHeaderRowProps, withMods, DataTableHeaderCellProps } from '@epam/uui';
import * as gearIcon from './../icons/settings-18.svg';
import * as css from './DataTableHeaderRow.scss';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { DataTableHeaderRowMods } from './types';
import { LinkButton } from '../buttons';

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
        renderConfigButton: () => <LinkButton key='configuration' onClick={ mods.onConfigButtonClick } cx={ css.configIcon } size='30' color='night600' icon={ gearIcon } />,
    }));