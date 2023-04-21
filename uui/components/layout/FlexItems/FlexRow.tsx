import { cx, FlexRowProps as uuiFlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';
import { RowSizeMod } from '../../types';
import css from './FlexRow.scss';

export interface RowMods extends RowSizeMod {
    borderBottom?: boolean;
    columnGap?: number | '6' | '12' | '18' | '24' | '36';
    margin?: '12' | '24';
    padding?: '6' | '12' | '18' | '24';
    rowGap?: number | '6' | '12' | '18' | '24' | '36';
    spacing?: '6' | '12' | '18';
    topShadow?: boolean;
    vPadding?: '12' | '18' | '24' | '36' | '48';
}

export interface FlexRowProps extends Omit<uuiFlexRowProps, 'columnGap' | 'rowGap'> {}

export const FlexRow = withMods<FlexRowProps, RowMods>(uuiFlexRow, (props) => {
    return [
        css.root, props.size !== null && css['size-' + (props.size || '36')], props.padding && css['padding-' + props.padding], props.vPadding && css['vPadding-' + props.vPadding], props.margin && css['margin-' + props.margin], props.topShadow && css.topShadow, props.borderBottom && css.borderBottom, props.spacing && css['spacing-' + props.spacing],
    ];
});
