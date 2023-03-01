import * as types from '../../types';
import { cx, FlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow, RowMods as uuiRowMods } from '@epam/uui';

export interface RowMods extends Omit<uuiRowMods, 'borderBottom'>, types.RowSizeMod {
    background?: 'white' | 'gray5' | 'none';
    borderBottom?: boolean | 'gray40';
}

export const FlexRow = withMods<FlexRowProps, RowMods>(
    uuiFlexRow,
    (props) => {
        return [
            `flex-row-${(props.background || 'none')}`,
        ];
    },
    (props) => ({
        borderBottom: props.borderBottom,
    } as FlexRowProps),
);
