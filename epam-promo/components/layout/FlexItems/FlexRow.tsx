import * as types from '../../types';
import css from './FlexRow.scss';
import { FlexRowProps, withMods } from '@epam/uui-core';
import { FlexRow as uuiFlexRow } from '@epam/uui-components';

export interface RowMods extends types.RowSizeMod {
    background?: 'white' | 'gray5' | 'none';
    borderBottom?: boolean | 'gray40';
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
        css['background-' + (props.background || 'none')],
        props.padding && css['padding-' + props.padding],
        props.vPadding && css['vPadding-' + props.vPadding],
        props.margin && css['margin-' + props.margin],
        props.topShadow && css.topShadow,
        props.borderBottom && (props.borderBottom === true ? css['border-bottom-gray40'] : css['border-bottom-' + props.borderBottom]),
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
