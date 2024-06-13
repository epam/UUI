import React, {
    CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef,
} from 'react';
import { Scrollbars as ReactCustomScrollBars } from 'react-custom-scrollbars-2';
import { IHasCX, cx, IHasRawProps } from '@epam/uui-core';
import css from './ScrollBars.module.scss';
import type { Scrollbars, ScrollbarProps as LibScrollbarProps, positionValues } from 'react-custom-scrollbars-2';

export interface ScrollbarProps extends IHasCX, Omit<LibScrollbarProps, 'ref'>, IHasRawProps<Scrollbars> {
    /** If true, shadow will be added to the top of container, in case when scroll isn't in top position */
    hasTopShadow?: boolean;
    /** If true, shadow will be added to the bottom of container, in case when scroll isn't in bottom position */
    hasBottomShadow?: boolean;
    /** Render callback for the scroll container.
     *
     * If omitted, default uui implementation with flex container will be rendered.
     */
    renderView?: (props: any) => React.ReactElement;
}

export interface PositionValues extends positionValues {
}

export interface ScrollbarsApi extends Scrollbars {
}

enum uuiScrollbars {
    uuiShadowTop = 'uui-shadow-top',
    uuiShadowBottom = 'uui-shadow-bottom',
    uuiThumbVertical = 'uui-thumb-vertical',
    uuiThumbHorizontal = 'uui-thumb-horizontal',
    uuiTrackVertical = 'uui-track-vertical',
    uuiTrackHorizontal = 'uui-track-horizontal',
    uuiShadowTopVisible = 'uui-shadow-top-visible',
    uuiShadowBottomVisible = 'uui-shadow-bottom-visible'
}

export const ScrollBars = forwardRef<ScrollbarsApi, ScrollbarProps>(({
    style: outerStyle, hasBottomShadow, hasTopShadow, rawProps, cx: outerCx, ...props
}, ref) => {
    const bars = useRef<ScrollbarsApi>();

    useImperativeHandle(ref, () => bars.current, [bars.current]);

    const handleUpdateScroll = (event?: React.UIEvent<ScrollbarsApi>) => {
        if (!bars.current) return;
        event && props.onScroll?.(event);
        const scrollBars = bars.current?.container;
        if (!scrollBars) return;
        const { scrollTop, scrollHeight, clientHeight } = bars.current.getValues();
        const showTopShadow = hasTopShadow && scrollTop > 0;
        const showBottomShadow = hasBottomShadow && scrollHeight - clientHeight > scrollTop;

        if (showTopShadow) scrollBars.classList.add(uuiScrollbars.uuiShadowTopVisible);
        else scrollBars.classList.remove(uuiScrollbars.uuiShadowTopVisible);

        if (showBottomShadow) scrollBars.classList.add(uuiScrollbars.uuiShadowBottomVisible);
        else scrollBars.classList.remove(uuiScrollbars.uuiShadowBottomVisible);
    };

    useEffect(handleUpdateScroll);

    const getIndent = (margin: string | number): string | number => {
        // for windows we need to get positive right margin to hide native scrollbar
        return typeof margin === 'string' ? (Math.abs(parseInt(margin, 10)) + 'px') : margin;
    };

    const customRenderView = ({ style: innerStyle, ...rest }: { style: CSSProperties; rest: {} }) => {
        const propsRenderView = props.renderView as (p: any) => any;
        const rv = propsRenderView?.({ style: { ...innerStyle, ...{ position: 'relative', flex: '1 1 auto', right: getIndent(innerStyle?.marginRight) } }, ...rest });
        return rv || <div style={ { ...innerStyle, ...{ position: 'relative', flex: '1 1 auto', right: getIndent(innerStyle?.marginRight) } } } { ...rest } />;
    };

    const { renderView, ...customProps } = props;

    return (
        <ReactCustomScrollBars
            className={ cx(css.root, outerCx, props.className, hasTopShadow && uuiScrollbars.uuiShadowTop, hasBottomShadow && uuiScrollbars.uuiShadowBottom) }
            renderView={ (params) => customRenderView(params) }
            renderTrackHorizontal={ (props: any) => <div { ...props } className={ uuiScrollbars.uuiTrackHorizontal } /> }
            renderTrackVertical={ (props: any) => <div { ...props } className={ uuiScrollbars.uuiTrackVertical } /> }
            renderThumbHorizontal={ () => <div className={ uuiScrollbars.uuiThumbHorizontal } /> }
            renderThumbVertical={ () => <div className={ uuiScrollbars.uuiThumbVertical } /> }
            style={ { ...{ display: 'flex' }, ...outerStyle } }
            onScroll={ handleUpdateScroll }
            hideTracksWhenNotNeeded
            ref={ bars }
            { ...customProps }
            { ...rawProps }
        />
    );
});
