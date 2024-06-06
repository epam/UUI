import * as types from '../../types';
import { withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface FlexRowMods extends types.RowSizeMod {
    /**
     * @default 'none'
     */
    background?: 'white' | 'gray5' | 'none' | uui.FlexRowProps['background'];
}
export type FlexRowProps = Omit<uui.FlexRowProps, 'background'> & FlexRowMods;

export const FlexRow = withMods<Omit<uui.FlexRowProps, 'background'>, FlexRowProps>(uui.FlexRow, (props) => {
    return [`uui-color-${props.background || 'none'}`];
});
