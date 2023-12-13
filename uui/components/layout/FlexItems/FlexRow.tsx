import { FlexRowProps as uuiFlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';
import css from './FlexRow.module.scss';

export type RowMods = {
    size?: null | '24' | '30' | '36' | '42' | '48';
    borderBottom?: boolean;
    columnGap?: number | '6' | '12' | '18' | '24' | '36';
    margin?: '12' | '24';
    padding?: '6' | '12' | '18' | '24';
    rowGap?: number | '6' | '12' | '18' | '24' | '36';
    spacing?: '6' | '12' | '18';
    topShadow?: boolean;
    vPadding?: '12' | '18' | '24' | '36' | '48';
    background?: 'surface-main';
};

export interface FlexRowProps extends Omit<uuiFlexRowProps, 'columnGap' | 'rowGap'>, RowMods {}

export const FlexRow = withMods<Omit<uuiFlexRowProps, 'columnGap' | 'rowGap'>, RowMods>(uuiFlexRow, (props) => {
    return [
        css.root,
        props.size !== null && css['size-' + (props.size || '36')],
        props.padding && css['padding-' + props.padding],
        props.vPadding && css['vPadding-' + props.vPadding],
        props.margin && css['margin-' + props.margin],
        props.topShadow && css.topShadow,
        props.borderBottom && css.borderBottom,
        props.spacing && css['spacing-' + props.spacing],
        props.background && css[`uui-${props.background}`],
    ];
});
