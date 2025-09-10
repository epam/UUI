import React, {
    forwardRef,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import cx from 'classnames';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import type { ScrollbarsAutoHideBehavior } from 'overlayscrollbars';
import { IHasCX, IHasRawProps, useScrollShadows } from '@epam/uui-core';
import 'overlayscrollbars/styles/overlayscrollbars.css';
import css from './ScrollBars.module.scss';

export type ScrollbarsApi = {
    /** Reference to the scrollbar container element */
    container: HTMLElement | null;
    /** Reference to the scrollable view element */
    view: HTMLElement | null;
};

export type ScrollbarProps = IHasCX & IHasRawProps<React.HTMLAttributes<HTMLDivElement>> & {
    /** Callback fired when scroll position changes */
    onScroll?: React.UIEventHandler<any>;
    /**
     * The scrollbars auto hide behavior
     * - 'never' - The scrollbars are always hidden.
     * - 'scroll' - The scrollbars are hidden unless the user scrolls.
     * - 'move' - The scrollbars are hidden unless the pointer moves in the host element or the user scrolls.
     * - 'leave' - The scrollbars are hidden if the pointer leaves the host element or unless the user scrolls.
     * @default 'never'
     */
    autoHide?: ScrollbarsAutoHideBehavior;
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
    children?: ReactNode | undefined;
};

enum uuiScrollbars {
    uuiShadowTop = 'uui-shadow-top',
    uuiShadowBottom = 'uui-shadow-bottom',
    uuiLineTop = 'uui-line-top',
    uuiLineBottom = 'uui-line-bottom'
}

export const ScrollBars = forwardRef<ScrollbarsApi, ScrollbarProps>((props, ref) => {
    const {
        cx: outerCx,
        children,
        overflowTopEffect = 'none',
        overflowBottomEffect = 'none',

        onScroll,

        autoHide = 'never',
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
                autoHide: autoHide,
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

    return (
        <div
            ref={ hostRef }
            className={ cx(
                css.root,
                outerCx,
                'uui-scroll-bars',
                overflowTopEffect === 'shadow' && uuiScrollbars.uuiShadowTop,
                overflowBottomEffect === 'shadow' && uuiScrollbars.uuiShadowBottom,
                overflowTopEffect === 'line' && uuiScrollbars.uuiLineTop,
                overflowBottomEffect === 'line' && uuiScrollbars.uuiLineBottom,
            ) }
            { ...rest }
            data-overlayscrollbars-initialize=""
        >
            <div
                className={ css.viewport }
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
