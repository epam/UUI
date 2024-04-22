import * as types from '../../types';
import * as uuiCore from '@epam/uui-core';
import * as uui from '@epam/uui';

export interface RowMods extends Omit<uui.RowMods, 'spacing' | 'background'>, types.RowSizeMod {
    /**
     * @default 'none'
     */
    background?: 'white' | 'night50' | 'night100' | 'none';
    spacing?: '6' | '12' | '18' | null;
    /**
     * @default 'panel'
     */
    type?: 'form' | 'panel';
}

export type FlexRowProps = uuiCore.FlexRowProps & RowMods;

const commonDefaults: FlexRowProps = {
    size: '36',
    background: 'none',
};

const rowTypesDefaults: Record<string, FlexRowProps> = {
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

export const FlexRow = uuiCore.withMods<uuiCore.FlexRowProps, FlexRowProps>(
    uui.FlexRow,
    (props) => {
        return [`uui-color-${props.background || 'none'}`];
    },
    (props) => {
        const defaults = rowTypesDefaults[props.type || 'panel'];
        return { ...defaults, ...props };
    },
);
