import { FlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';
import { RowSizeMod } from '../../types';
import css from './FlexRow.scss';

export interface RowMods extends RowSizeMod {
    topShadow?: boolean;
    borderBottom?: boolean;
    padding?: '6' | '12' | '18' | '24';
    vPadding?: '12' | '18' | '24' | '36' | '48';
    spacing?: '6' | '12' | '18';
    margin?: '12' | '24';
}

export const FlexRow = withMods<FlexRowProps, RowMods & FlexRowProps>(uuiFlexRow, props => {
    return [
        css.root,
        props.size !== null && css['size-' + (props.size || '36')],
        props.padding && css['padding-' + props.padding],
        props.vPadding && css['vPadding-' + props.vPadding],
        props.margin && css['margin-' + props.margin],
        props.topShadow && css.topShadow,
        props.borderBottom && css['border-bottom'],
        props.spacing && css['spacing-' + props.spacing],
    ];
});
