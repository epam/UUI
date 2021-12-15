import * as React from 'react';
import Scrollbars, * as CustomScrollBars from 'react-custom-scrollbars-2';
import { IHasCX, cx, IHasRawProps } from '@epam/uui';
import * as css from './ScrollBars.scss';

export interface ScrollbarProps extends IHasCX, CustomScrollBars.ScrollbarProps, IHasRawProps<Scrollbars> {
    hasTopShadow?: boolean;
    hasBottomShadow?: boolean;
    ref?: React.MutableRefObject<Scrollbars>;
};

export interface PositionValues extends CustomScrollBars.positionValues {};

export interface ScrollbarsApi extends Scrollbars {};

enum uuiScrollbars {
    uuiShadowTop = 'uui-shadow-top',
    uuiShadowBottom = 'uui-shadow-bottom',
    uuiThumbVertical = 'uui-thumb-vertical',
    uuiThumbHorizontal = 'uui-thumb-horizontal',
    uuiTrackVertical = 'uui-track-vertical',
    uuiTrackHorizontal = 'uui-track-horizontal',
    uuiShadowTopVisible = 'uui-shadow-top-visible',
    uuiShadowBottomVisible = 'uui-shadow-bottom-visible',
};

export const ScrollBars = React.forwardRef<ScrollbarsApi, ScrollbarProps>(({
    style,
    hasBottomShadow,
    hasTopShadow,
    rawProps,
    ...props
}, ref) => {
    const bars = React.useRef<ScrollbarsApi>();

    React.useImperativeHandle(ref, () => bars.current, [bars.current]);

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

    React.useEffect(handleUpdateScroll);

    const renderView = ({ style, ...rest }: { style: React.CSSProperties, rest: {} }) =>
        props.renderView?.({ style: { ...style, ...{ position: 'relative', flex: '1 1 auto' } }, ...rest }) || (
        <div style={ { ...style, ...{ position: 'relative', flex: '1 1 auto' } } } { ...rest } />
    );

    return (
        <CustomScrollBars.default
            className={ cx(
                css.root,
                props.cx,
                props.className,
                hasTopShadow && uuiScrollbars.uuiShadowTop,
                hasBottomShadow && uuiScrollbars.uuiShadowBottom,
            ) }
            renderView={ renderView }
            renderTrackHorizontal={ props => <div { ...props } className={ uuiScrollbars.uuiTrackHorizontal } /> }
            renderTrackVertical={ props => <div { ...props } className={ uuiScrollbars.uuiTrackVertical } />}
            renderThumbHorizontal={ () => <div className={ uuiScrollbars.uuiThumbHorizontal } /> }
            renderThumbVertical={ () => <div className={ uuiScrollbars.uuiThumbVertical } /> }
            style={ { ...{ display: 'flex' }, ...style } }
            onScroll={ handleUpdateScroll }
            hideTracksWhenNotNeeded
            ref={ bars }
            { ...props }
            { ...rawProps }
        />
    );
});