import * as types from '../../types';
import * as css from './FlexRow.scss';
import { FlexRowProps, withMods } from '@epam/uui';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';

export interface RowMods extends types.RowSizeMod {
    background?: 'white' | 'night50' | 'night100' | 'none';
    topShadow?: boolean;
    borderBottom?: boolean | 'night50' | 'night400' | 'night700' | 'night300';
    padding?: '6' | '12' | '18' | '24';
    vPadding?: '12' | '18' | '24';
    spacing?: '6' | '12' | '18' | null;
    type?: 'form' | 'panel';
    margin?: '12' | '24';
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

export const FlexRow = withMods<FlexRowProps, RowMods & FlexRowProps>(uuiFlexRow, props => {
    const defaults = rowTypesDefaults[props.type || 'panel'];
    props = { ...defaults, ...props };

    return [
        css.root,
        css['size-' + props.size],
        css['background-' + props.background],
        props.padding && css['padding-' + props.padding],
        props.vPadding && css['vPadding-' + props.vPadding],
        props.margin && css['margin-' + props.margin],
        props.topShadow && css.topShadow,
        props.borderBottom && (props.borderBottom === true ? css['border-bottom-night400'] : css['border-bottom-' + props.borderBottom]),
        css['spacing-' + props.spacing],
    ];
});
