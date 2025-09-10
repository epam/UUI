import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { IHasCX, IHasRawProps, useScrollShadows } from '@epam/uui-core';
import cx from 'classnames';
import 'overlayscrollbars/styles/overlayscrollbars.css';
import css from './ScrollBars.module.scss';

export type ScrollbarsApi = {
    /** Reference to the scrollbar container element */
    container: HTMLElement | null;
    /** Reference to the scrollable view element */
    view: HTMLElement | null;
};

export type ScrollbarProps = React.HTMLAttributes<HTMLDivElement> & IHasCX & IHasRawProps<React.HTMLAttributes<HTMLDivElement>> & {
    /** Callback fired when scroll position changes */
    onScroll?: React.UIEventHandler<any>;

    /**
     * Whether scrollbars should automatically hide when not in use
     * @default false
     */
    autoHide?: boolean;
    /**
     * Delay in milliseconds before scrollbars hide after scrolling stops
     * @default 1300
     */
    autoHideDelay?: number;
    /**
     * Visual effect to show at the top when content is scrolled down
     * - 'line': shows a thin line border
     * - 'shadow': shows a gradient shadow
     * - 'none': no visual effect
     * @default 'none'
     */
    overflowTopEffect?: 'line' | 'shadow' | 'none';
    /**
     * Visual effect to show at the bottom when content can be scrolled down
     * - 'line': shows a thin line border
     * - 'shadow': shows a gradient shadow
     * - 'none': no visual effect
     * @default 'none'
     */
    overflowBottomEffect?: 'line' | 'shadow' | 'none';
};

enum uuiScrollbars {
    uuiShadowTop = 'uui-shadow-top',
    uuiShadowBottom = 'uui-shadow-bottom',
    uuiLineTop = 'uui-line-top',
    uuiLineBottom = 'uui-line-bottom'
}

export const ScrollBars = forwardRef<ScrollbarsApi, ScrollbarProps>((props, ref) => {
    const {
        className,
        cx: outerCx,
        style,
        children,
        overflowTopEffect = 'none',
        overflowBottomEffect = 'none',

        onScroll,

        autoHide,
        autoHideDelay,
        rawProps,
        ...rest
    } = props;
    const [shadowElements, setShadowElements] = useState<{ host: HTMLElement | null, viewport: HTMLElement | null }>({
        host: null,
        viewport: null,
    });

    const hostRef = useRef<HTMLDivElement | null>(null);
    const viewportRef = useRef<HTMLElement | null>(null);
    const containerRef = useRef<HTMLElement | null>(null);

    const [initialize, osInstance] = useOverlayScrollbars({
        options: {
            scrollbars: {
                theme: 'uui-scroll-bars',
                autoHide: autoHide === true ? 'move' : 'never',
                autoHideDelay: typeof autoHideDelay === 'number' ? autoHideDelay : undefined,
            },
        },
        events: {
            scroll: (_inst, ev) => {
                onScroll?.(ev as unknown as React.UIEvent<ScrollbarsApi>);
            },
        },
    });

    useEffect(() => {
        const host = hostRef.current;
        const vp = viewportRef.current;
        if (!host || !vp) return;

        initialize({
            target: host,
            elements: {
                viewport: vp,
                content: vp,
            },
        });

        return () => {
            osInstance()?.destroy();
        };
    }, [initialize, osInstance]);

    useEffect(() => {
        const instance = osInstance();
        if (!instance) return;

        const elements = instance.elements();
        setShadowElements({
            host: elements.host,
            viewport: elements.viewport,
        });
    }, [osInstance]);

    useScrollShadows(shadowElements.host, shadowElements.viewport);

    useImperativeHandle(ref, (): ScrollbarsApi => {
        return {
            container: containerRef.current,
            view: viewportRef.current,
        };
    }, []);

    const rcs2InnerStyleBase: React.CSSProperties = useMemo(() => {
        return { marginRight: 0, marginBottom: 0 };
    }, []);

    const hostStyle: React.CSSProperties = useMemo(() => {
        return {
            ...style,
        };
    }, [style]);

    const innerStyle: React.CSSProperties = {
        ...rcs2InnerStyleBase,
        position: 'relative',
        flex: '1 1 auto',
    };

    return (
        <div
            ref={ hostRef }
            className={ cx(
                css.root,
                className,
                outerCx,
                overflowTopEffect === 'shadow' && uuiScrollbars.uuiShadowTop,
                overflowBottomEffect === 'shadow' && uuiScrollbars.uuiShadowBottom,
                overflowTopEffect === 'line' && uuiScrollbars.uuiLineTop,
                overflowBottomEffect === 'line' && uuiScrollbars.uuiLineBottom,
            ) }
            style={ hostStyle }
            { ...rest }
            data-overlayscrollbars-initialize=""
        >
            <div
                style={ innerStyle }
                data-overlayscrollbars-contents=""
                ref={ (node) => { viewportRef.current = node; } }
                { ...rawProps }
            >
                {children}
            </div>
        </div>
    );
});

ScrollBars.displayName = 'ScrollBars';
