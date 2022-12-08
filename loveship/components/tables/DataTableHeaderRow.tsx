import * as React from 'react';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { DataTableHeaderRowProps, withMods } from '@epam/uui-core';
import { ReactComponent as GearIcon } from './../icons/settings-18.svg';
import css from './DataTableHeaderRow.scss';
import { DataTableHeaderCell } from './DataTableHeaderCell';
import { DataTableHeaderRowMods } from './types';
import { LinkButton } from '../buttons';

export const DataTableHeaderRow = withMods<DataTableHeaderRowProps, DataTableHeaderRowMods>(
    uuiDataTableHeaderRow,
    mods => [css.root],
    mods => ({
        renderCell: props => <DataTableHeaderCell
            { ...props }
            size={ mods.size }
            textCase={ mods.textCase || 'normal' }
            key={ props.column.key }
        />,
        renderConfigButton: () => <LinkButton
            key='configuration'
            onClick={ mods.onConfigButtonClick }
            cx={ css.configIcon }
            size='30'
            color='night600'
            icon={ GearIcon }
        />,
    }));
