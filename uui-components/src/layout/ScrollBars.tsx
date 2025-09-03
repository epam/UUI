import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { IHasCX, IHasRawProps } from '@epam/uui-core';
import cx from 'classnames';
import 'overlayscrollbars/styles/overlayscrollbars.css';
import css from './ScrollBars.module.scss';

export type ScrollbarsApi = {
    container: HTMLElement | null;
    view: HTMLElement | null;
};

export type ScrollbarProps = React.HTMLAttributes<HTMLDivElement> & IHasCX & IHasRawProps<React.HTMLAttributes<HTMLDivElement>> & {
    onScroll?: React.UIEventHandler<any>;

    autoHide?: boolean;
    autoHideTimeout?: number;
    autoHideDuration?: number;
    /* @deprecated use css variable to change min size */
    thumbMinSize?: number;
    hasTopShadow?: boolean;
    hasBottomShadow?: boolean;
};

enum uuiScrollbars {
    uuiShadowTop = 'uui-shadow-top',
    uuiShadowBottom = 'uui-shadow-bottom',
    uuiShadowTopVisible = 'uui-shadow-top-visible',
    uuiShadowBottomVisible = 'uui-shadow-bottom-visible'
}

export const ScrollBars = forwardRef<ScrollbarsApi, ScrollbarProps>((props, ref) => {
    const {
        className,
        cx: outerCx,
        style,
        children,
        hasTopShadow,
        hasBottomShadow,

        onScroll,

        autoHide,
        autoHideTimeout,
        autoHideDuration,
        thumbMinSize,
        rawProps,
        ...rest
    } = props;

    // DOM refs
    const hostRef = useRef<HTMLDivElement | null>(null);
    const viewportRef = useRef<HTMLElement | null>(null);

    // Создаем контейнер который эмулирует структуру RCS2 для VirtualList
    const containerRef = useRef<HTMLElement | null>(null);

    const handleUpdateScroll = () => {
        const instance = osInstance();
        if (!instance || !hostRef.current) return;

        const { scrollOffsetElement } = instance.elements();
        if (!scrollOffsetElement) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollOffsetElement;
        const showTopShadow = hasTopShadow && scrollTop > 0;
        const showBottomShadow = hasBottomShadow && scrollTop < scrollHeight - clientHeight - 1;

        if (showTopShadow) hostRef.current.classList.add(uuiScrollbars.uuiShadowTopVisible);
        else hostRef.current.classList.remove(uuiScrollbars.uuiShadowTopVisible);

        if (showBottomShadow) hostRef.current.classList.add(uuiScrollbars.uuiShadowBottomVisible);
        else hostRef.current.classList.remove(uuiScrollbars.uuiShadowBottomVisible);
    };

    // Хук OS: только options + events
    const [initialize, osInstance] = useOverlayScrollbars({
        options: {
            scrollbars: {
                theme: 'uui-scroll-bars',
                autoHide: autoHide === true ? 'move' : 'never',
                autoHideDelay:
                    typeof autoHideDuration === 'number'
                        ? autoHideDuration
                        : typeof autoHideTimeout === 'number'
                            ? autoHideTimeout
                            : undefined,
            },
        },
        events: {
            scroll: (_inst, ev) => {
                handleUpdateScroll();
                onScroll?.(ev as unknown as React.UIEvent<ScrollbarsApi>);
            },
        },
    });

    // Инициализация OS с указанием elements
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

    // Обновляем тени при первоначальной загрузке
    useEffect(() => {
        handleUpdateScroll();
    });

    // Императивный RCS2 API наружу
    useImperativeHandle(ref, (): ScrollbarsApi => {
        return {
            container: containerRef.current,
            view: viewportRef.current,
        };
    }, []);

    // Базовый innerStyle, как в UUI customRenderView
    const rcs2InnerStyleBase: React.CSSProperties = useMemo(() => {
        return { marginRight: 0, marginBottom: 0 };
    }, []);

    const hostStyle: React.CSSProperties = useMemo(() => {
        return {
            ...style,
            height: '100%',
            width: '100%',
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
            className={ cx(css.root, className, outerCx, hasTopShadow && uuiScrollbars.uuiShadowTop, hasBottomShadow && uuiScrollbars.uuiShadowBottom) }
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
