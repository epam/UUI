import * as types from '../../types';
import { withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';

export interface RowMods extends Omit<uui.RowMods, 'background'>, types.RowSizeMod {
    /**
     * @default 'none'
     */
    background?: 'white' | 'gray5' | 'none';
}
export type FlexRowProps = uui.FlexRowProps & RowMods;

export const FlexRow = withMods<uui.FlexRowProps, RowMods>(uui.FlexRow, (props) => {
    return [`uui-color-${props.background || 'none'}`];
});
