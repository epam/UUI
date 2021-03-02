import * as types from '../../types';
import * as css from './FlexRow.scss';
import { FlexRowProps, withMods } from '@epam/uui';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';

export interface RowMods extends types.RowSizeMod {
    background?: 'white' | 'gray5' | 'none';
    topShadow?: boolean;
    borderBottom?: boolean | 'gray40';
    padding?: '6' | '12' | '18' | '24';
    vPadding?: '12' | '18' | '24' | '48';
    spacing?: '6' | '12' | '18';
    margin?: '12' | '24';
}

export const FlexRow = withMods<FlexRowProps, RowMods & FlexRowProps>(uuiFlexRow, props => {
    return [
        css.root,
        css['size-' + (props.size || '36')],
        css['background-' + (props.background || 'none')],
        props.padding && css['padding-' + props.padding],
        props.vPadding && css['vPadding-' + props.vPadding],
        props.margin && css['margin-' + props.margin],
        props.topShadow && css.topShadow,
        props.borderBottom && (props.borderBottom === true ? css['border-bottom-gray40'] : css['border-bottom-' + props.borderBottom]),
        props.spacing && css['spacing-' + props.spacing],
    ];
});
