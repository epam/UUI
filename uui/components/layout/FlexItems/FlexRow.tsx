import { FlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';
import { RowSizeMod } from '../../types';
import css from './FlexRow.scss';

export interface RowMods extends RowSizeMod {
    borderBottom?: boolean;
    columnGap?: number;
    margin?: '12' | '24';
    padding?: '6' | '12' | '18' | '24';
    rowGap?: number;
    spacing?: '6' | '12' | '18';
    topShadow?: boolean;
    vPadding?: '12' | '18' | '24' | '36' | '48';
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
},
props => {
    const styles: {columnGap?: string; rowGap?: string} = {};
    if (props.columnGap) {
        styles.columnGap = `${ props.columnGap }px`;
    } else if (props.rowGap) {
        styles.rowGap = `${ props.rowGap }px`;
    }

    if (props.columnGap || props.rowGap) {
        return {rawProps: {
            style: styles,
        }};
    }
});
