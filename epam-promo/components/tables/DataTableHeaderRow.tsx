import * as React from 'react';
import { DataTableHeaderRow as uuiDataTableHeaderRow } from '@epam/uui-components';
import { DataTableHeaderRowProps, withMods } from '@epam/uui';
import { IconButton, DataTableHeaderCell, DataTableHeaderRowMods } from '../';
import * as css from './DataTableHeaderRow.scss';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/action-settings-18.svg';

export const DataTableHeaderRow = withMods<DataTableHeaderRowProps, DataTableHeaderRowMods>(
    uuiDataTableHeaderRow,
    mods => [css.root],
    mods => ({
        renderCell: props => <DataTableHeaderCell
            key={ props.column.key + (props.value.columnsConfig?.[props.column.key]?.order || '')  }
            { ...props }
            size={ mods.size }
            textCase={ mods.textCase || 'normal' }
        />,
        renderConfigButton: () => <IconButton
            key='configuration'
            onClick={ mods.onConfigButtonClick }
            cx={ css.configIcon }
            color='gray60'
            icon={ MoreIcon }
        />,
    }));