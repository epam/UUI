import * as uuiCore from '@epam/uui-core';
import * as uui from '@epam/uui';

export interface RowMods extends Omit<uui.FlexRowMods, 'spacing' | 'background'> {
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
        columnGap: '12',
        alignItems: 'top',
        vPadding: '18',
        padding: '24',
    },
    panel: {
        ...commonDefaults,
        alignItems: 'center',
        columnGap: '6',
        size: '36',
    },
};

export const FlexRow = uuiCore.withMods<uuiCore.FlexRowProps, FlexRowProps>(
    uui.FlexRow,
    (props) => {
        return [`uui-flex-row-bg-${props.background || 'none'}`];
    },
    (props) => {
        const defaults = rowTypesDefaults[props.type || 'panel'];
        return { ...defaults, ...props };
    },
);
