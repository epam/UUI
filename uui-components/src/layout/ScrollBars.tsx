import React, { CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Scrollbars as ReactCustomScrollBars } from 'react-custom-scrollbars-2';
import { IHasCX, cx, IHasRawProps, useDeferRenderForSsr } from '@epam/uui-core';
import css from './ScrollBars.scss';
import type { Scrollbars, ScrollbarProps as LibScrollbarProps, positionValues } from 'react-custom-scrollbars-2';

export interface ScrollbarProps extends IHasCX, Omit<LibScrollbarProps, 'ref'>, IHasRawProps<Scrollbars> {
    hasTopShadow?: boolean;
    hasBottomShadow?: boolean;
    renderView?: (props: any) => React.ReactElement;
}

export interface PositionValues extends positionValues {}

export interface ScrollbarsApi extends Scrollbars {}

enum uuiScrollbars {
    uuiShadowTop = 'uui-shadow-top',
    uuiShadowBottom = 'uui-shadow-bottom',
    uuiThumbVertical = 'uui-thumb-vertical',
    uuiThumbHorizontal = 'uui-thumb-horizontal',
    uuiTrackVertical = 'uui-track-vertical',
    uuiTrackHorizontal = 'uui-track-horizontal',
    uuiShadowTopVisible = 'uui-shadow-top-visible',
    uuiShadowBottomVisible = 'uui-shadow-bottom-visible',
}

/**
 * This method is needed to fix hydration error.
 * Root cause: "react-custom-scrollbars-2" tries to calculate scrollbar width and some other styles even in SSR mode.
 * So the solution here is to omit conflicting styles on first render.
 */
function filterOutStylesNotReadyForRender(styles: CSSProperties, isDeferred: boolean) {
    if (!isDeferred) {
        return styles;
    }
    const stylesFiltered = { ...styles };
    delete stylesFiltered.display;
    delete stylesFiltered.marginRight;
    delete stylesFiltered.marginBottom;
    return stylesFiltered;
}

export const ScrollBars = forwardRef<ScrollbarsApi, ScrollbarProps>(({
    style,
    hasBottomShadow,
    hasTopShadow,
    rawProps,
    ...props
}, ref) => {
    const bars = useRef<ScrollbarsApi>();
    const { isDeferred } = useDeferRenderForSsr();

    useImperativeHandle(ref, () => bars.current, [bars.current]);

    const handleUpdateScroll = (event?: React.UIEvent<ScrollbarsApi>) => {
        if (!bars.current) return;
        event && props.onScroll?.(event);

        const scrollBars = bars.current?.container;
        if (!scrollBars) return;
        const { scrollTop, scrollHeight, clientHeight } = bars.current.getValues();
        const showTopShadow = hasTopShadow && scrollTop > 0;
        const showBottomShadow = hasBottomShadow && (scrollHeight - clientHeight > scrollTop);

        if (showTopShadow) scrollBars.classList.add(uuiScrollbars.uuiShadowTopVisible);
        else scrollBars.classList.remove(uuiScrollbars.uuiShadowTopVisible);

        if (showBottomShadow) scrollBars.classList.add(uuiScrollbars.uuiShadowBottomVisible);
        else scrollBars.classList.remove(uuiScrollbars.uuiShadowBottomVisible);
    };

    useEffect(handleUpdateScroll);

    const renderSafeForSsr = {
        renderView: ({ style }: { style: CSSProperties }) => {
            const styleFiltered = filterOutStylesNotReadyForRender(style, isDeferred);
            if (props.renderView) {
                return props.renderView({ style: styleFiltered });
            }
            return (
                <div style={ { ...styleFiltered, ...{ position: 'relative', flex: '1 1 auto' } } } />
            );
        },
        renderTrackHorizontal: ({ style }: { style: CSSProperties }) => {
            const styleFiltered = filterOutStylesNotReadyForRender(style, isDeferred);
            return <div style={ styleFiltered } className={ uuiScrollbars.uuiTrackHorizontal } />;
        },
        renderTrackVertical: ({ style }: { style: CSSProperties }) => {
            const styleFiltered = filterOutStylesNotReadyForRender(style, isDeferred);
            return <div style={ styleFiltered } className={ uuiScrollbars.uuiTrackVertical } />;
        },
    };

    const { renderView, renderTrackHorizontal, renderTrackVertical, ...propsNonConflicting } = props;

    return (
        <ReactCustomScrollBars
            className={ cx(
                css.root,
                props.cx,
                props.className,
                hasTopShadow && uuiScrollbars.uuiShadowTop,
                hasBottomShadow && uuiScrollbars.uuiShadowBottom,
            ) }
            renderView={ renderSafeForSsr.renderView }
            renderTrackHorizontal={ renderSafeForSsr.renderTrackHorizontal }
            renderTrackVertical={ renderSafeForSsr.renderTrackVertical }
            renderThumbHorizontal={ () => <div className={ uuiScrollbars.uuiThumbHorizontal } /> }
            renderThumbVertical={ () => <div className={ uuiScrollbars.uuiThumbVertical } /> }
            style={ { ...{ display: 'flex' }, ...style } }
            onScroll={ handleUpdateScroll }
            hideTracksWhenNotNeeded
            ref={ bars }
            { ...propsNonConflicting }
            { ...rawProps }
        />
    );
});
