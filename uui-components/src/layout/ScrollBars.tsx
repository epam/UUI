import React, { CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Scrollbars, * as CustomScrollBars from 'react-custom-scrollbars-2';
import { IHasCX, cx } from '@epam/uui';
import * as css from './ScrollBars.scss';

export interface ScrollbarProps extends IHasCX, CustomScrollBars.ScrollbarProps {
    hasTopShadow?: boolean;
    hasBottomShadow?: boolean;
    ref?: React.MutableRefObject<Scrollbars>;
}

export interface PositionValues extends CustomScrollBars.positionValues {}

export interface ScrollbarsApi extends Scrollbars {}

export const ScrollBars = forwardRef(({
    style,
    hasBottomShadow,
    hasTopShadow,
    ...props
}: ScrollbarProps, ref) => {
    const bars = useRef<Scrollbars>();

    useImperativeHandle(ref, () => bars.current, [bars.current]);

    const handleUpdateScroll = (event?: React.UIEvent) => {
        if (!bars.current) return;
        event && props.onScroll?.(event);

        const scrollBars = bars.current.container;
        const { scrollTop, scrollHeight, clientHeight } = bars.current.getValues();
        const showBottomShadow = hasBottomShadow && (scrollHeight - clientHeight > scrollTop);

        if (hasTopShadow && scrollTop > 0) {
            scrollBars?.classList?.add('uui-shadow-top-visible');
        } else {
            scrollBars?.classList?.remove('uui-shadow-top-visible');
        }

        if (showBottomShadow) {
            scrollBars?.classList?.add('uui-shadow-bottom-visible');
        } else {
            scrollBars?.classList?.remove('uui-shadow-bottom-visible');
        }
    };

    useEffect(handleUpdateScroll);

    const renderView = ({ style, ...rest }: { style: CSSProperties, rest: {} }) => (
        <div
            style={ { ...style, ...{ position: 'relative', flex: '1 1 auto' } } }
            { ...rest }
        />
    );

    return (
        <CustomScrollBars.default
            { ...props }
            className={ cx(
                css.root,
                props.cx,
                props.className,
                hasTopShadow && "uui-shadow-top",
                hasBottomShadow && "uui-shadow-bottom",
            ) }
            renderView={ props.renderView || renderView }
            renderThumbHorizontal={ () => <div className="uui-thumb-horizontal" /> }
            renderThumbVertical={ () => <div className="uui-thumb-vertical"/> }
            style={ { ...{ display: 'flex' }, ...style } }
            onScroll={ handleUpdateScroll }
            ref={ bars }
        >
            { props.children }
        </CustomScrollBars.default>
    );
});