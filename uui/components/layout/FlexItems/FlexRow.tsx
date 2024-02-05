import { FlexRowProps as uuiFlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';
import css from './FlexRow.module.scss';

export type RowMods = {
    /** Defines row size */
    size?: null | '24' | '30' | '36' | '42' | '48';
    /** Pass true, to enable row bottom border */
    borderBottom?: boolean;
    /** Defines row column gap */
    columnGap?: number | '6' | '12' | '18' | '24' | '36';
    /** Defines row margin */
    margin?: '12' | '24';
    /** Defines horizontal row padding */
    padding?: '6' | '12' | '18' | '24';
    /** Defines row gap */
    rowGap?: number | '6' | '12' | '18' | '24' | '36';
    /** Defines row spacing */
    spacing?: '6' | '12' | '18';
    /** Pass true, to show a top shadow */
    topShadow?: boolean;
    /** Defines vertical row padding */
    vPadding?: '12' | '18' | '24' | '36' | '48';
    /** Defines row background */
    background?: 'surface-main';
};

/** Represents the properties of the FlexRow component. */
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
