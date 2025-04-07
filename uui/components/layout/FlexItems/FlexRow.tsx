import React from 'react';
import {
    devLogger,
    FlexRowProps as uuiFlexRowProps,
    isEventTargetInsideClickable,
    uuiMarkers,
    cx, Overwrite,
} from '@epam/uui-core';

import { settings } from '../../../settings';

import css from './FlexRow.module.scss';

export interface FlexRowMods {
    /**
     *  Defines row size
     *  @default '36'
     */
    size?: null | '24' | '30' | '36' | '42' | '48';
    /** Pass true, to enable row top border */
    borderTop?: boolean;
    /** Pass true, to enable row bottom border */
    borderBottom?: boolean;
    /** Defines row margin */
    margin?: '12' | '24';
    /** Defines horizontal row padding */
    padding?: '6' | '12' | '18' | '24';
    /**
     * @deprecated
     * The `spacing` property is deprecated and will be removed in future versions. Please use `columnGap` instead.
     * Defines row spacing
     * */
    spacing?: '6' | '12' | '18';
    /** Pass true, to show a top shadow */
    topShadow?: boolean;
    /** Defines vertical row padding */
    vPadding?: '12' | '18' | '24' | '36' | '48';
    /** Flexbox column gap property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-gap-row-gap-column-gap) */
    columnGap?: number | '6' | '12' | '18' | '24' | '36';
    /** Flexbox row gap property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-gap-row-gap-column-gap) */
    rowGap?: number | '6' | '12' | '18' | '24' | '36';
    /** Defines row background */
    background?: 'surface-main';
}

export interface FlexRowModsOverride {}

/** Represents the properties of the FlexRow component. */
export interface FlexRowProps extends uuiFlexRowProps, Overwrite<FlexRowMods, FlexRowModsOverride> {}

export const FlexRow = (props: FlexRowProps & React.RefAttributes<HTMLDivElement>) => {
    if (__DEV__) {
        if (props.spacing) {
            devLogger.warn('[FlexRow]: The `spacing` property is deprecated and will be removed in future versions. Please use `columnGap` instead.');
        }
    }

    const classNames = cx([
        css.root,
        'uui-flex-row',
        props.onClick && uuiMarkers.clickable,
        props.cx,
        props.size !== null && 'uui-size-' + (props.size || settings.flexRow.sizes.default),
        props.alignItems && css.alignItems,
        props.justifyContent && css.justifyContent,
        props.padding && css.padding,
        props.vPadding && css.vPadding,
        props.margin && css.margin,
        props.topShadow && css.topShadow,
        props.borderBottom && css.borderBottom,
        props.borderTop && css.borderTop,
        props.columnGap && css.columnGap,
        props.rowGap && css.rowGap,
        props.spacing && css.spacing,
        props.background && `uui-flex-row-bg-${props.background}`,
    ]);

    const style = {
        ...(props.alignItems && { '--uui-flex-row-align-items': props.alignItems }),
        ...(props.justifyContent && { '--uui-flex-row-justify-content': props.justifyContent }),
        ...(props.columnGap && { '--uui-flex-row-column-gap': `${props.columnGap}px` }),
        ...(props.rowGap && { '--uui-flex-row-row-gap': `${props.rowGap}px` }),
        ...(props.padding && { '--uui-flex-row-padding': `${props.padding}px` }),
        ...(props.vPadding && { '--uui-flex-row-v-padding': `${props.vPadding}px` }),
        ...(props.margin && { '--uui-flex-row-margin': `${props.margin}px` }),
        ...(props.spacing && { '--uui-flex-row-spacing': `${props.spacing}px` }),
    };

    return (
        <div
            ref={ props.ref }
            onClick={ props.onClick ? (e) => !isEventTargetInsideClickable(e) && props.onClick(e) : undefined }
            className={ classNames }
            { ...props.rawProps }
            style={ {
                ...style,
                ...props.rawProps?.style,
            } }
        >
            {props.children}
        </div>
    );
};
