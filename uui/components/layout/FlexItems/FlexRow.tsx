import { devLogger, FlexRowProps as uuiFlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';
import css from './FlexRow.module.scss';

export type RowMods = {
    /** Defines row size */
    size?: null | '24' | '30' | '36' | '42' | '48';
    /** Pass true, to enable row top border */
    borderTop?: boolean;
    /** Pass true, to enable row bottom border */
    borderBottom?: boolean;
    /** Defines row margin */
    margin?: '12' | '24';
    /** Defines horizontal row padding */
    padding?: '6' | '12' | '18' | '24';
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
export interface FlexRowProps extends uuiFlexRowProps, RowMods {}

export const FlexRow = /* @__PURE__ */withMods<uuiFlexRowProps, RowMods>(uuiFlexRow, (props) => {
    if (__DEV__) {
        if (props.spacing) {
            devLogger.warn('[FlexRow]: The `spacing` property is deprecated and will be removed in future versions. Please use `columnGap` instead.');
        }
    }

    return [
        css.root,
        props.size !== null && css['size-' + (props.size || '36')],
        props.padding && css['padding-' + props.padding],
        props.vPadding && css['vPadding-' + props.vPadding],
        props.margin && css['margin-' + props.margin],
        props.topShadow && css.topShadow,
        props.borderBottom && css.borderBottom,
        props.borderTop && css.borderTop,
        props.spacing && css['spacing-' + props.spacing],
        props.background && css[`uui-${props.background}`],
    ];
});
