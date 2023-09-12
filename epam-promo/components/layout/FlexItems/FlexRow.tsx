import * as types from '../../types';
import { FlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow, RowMods as uuiRowMods } from '@epam/uui';

export interface RowMods extends uuiRowMods, types.RowSizeMod {
    background?: 'white' | 'gray5' | 'none';
}

export const FlexRow = withMods<FlexRowProps, RowMods>(uuiFlexRow, (props) => {
    return [props.background !== 'none' && `uui-color-${props.background}`];
});
