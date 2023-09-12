import * as types from '../../types';
import { FlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow, RowMods as uuiRowMods } from '@epam/uui';

export interface RowMods extends Omit<uuiRowMods, 'spacing'>, types.RowSizeMod {
    background?: 'white' | 'night50' | 'night100' | 'none';
    spacing?: '6' | '12' | '18' | null;
    type?: 'form' | 'panel';
}

const commonDefaults: RowMods & FlexRowProps = {
    size: '36',
    background: 'none',
};

const rowTypesDefaults: Record<string, RowMods & FlexRowProps> = {
    form: {
        ...commonDefaults,
        spacing: '12',
        alignItems: 'top',
        vPadding: '18',
        padding: '24',
    },
    panel: {
        ...commonDefaults,
        alignItems: 'center',
        spacing: '6',
        size: '36',
    },
};

export const FlexRow = withMods<FlexRowProps, RowMods>(
    uuiFlexRow,
    (props) => {
        return [props.background !== 'none' && `uui-color-${props.background}`];
    },
    (props) => {
        const defaults = rowTypesDefaults[props.type || 'panel'];
        return { ...defaults, ...props };
    },
);
