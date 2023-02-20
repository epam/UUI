import * as React from 'react';
import { IHasCX, IEditable, VirtualListState, IHasRawProps, useVirtualList, useScrollShadows, cx, uuiMarkers } from '@epam/uui-core';
import { PositionValues, ScrollBars, ScrollbarsApi } from '../layout';
import css from './VirtualList.scss';

export interface VirtualListRenderRowsParams<List extends HTMLElement = any> {
    listContainerRef: React.MutableRefObject<List>;
    estimatedHeight: number;
    offsetY: number;
    scrollShadows: {
        vertical: boolean;
        horizontalLeft: boolean;
        horizontalRight: boolean;
    };
}

export interface VirtualListProps<List extends HTMLElement = any, ScrollContainer extends HTMLElement = any>
    extends IHasCX,
        IEditable<VirtualListState>,
        IHasRawProps<ScrollContainer> {
    rows: React.ReactNode[];
    rowsCount?: number;
    role?: React.HTMLAttributes<HTMLDivElement>['role'];
    renderRows?: (config: VirtualListRenderRowsParams<List>) => React.ReactNode;
    onScroll?(value: PositionValues): void;
}

export const VirtualList = React.forwardRef<ScrollbarsApi, VirtualListProps>((props, ref) => {
    const { listContainerRef, offsetY, handleScroll, estimatedHeight, scrollContainerRef } = useVirtualList({
        value: props.value,
        onValueChange: props.onValueChange,
        onScroll: props.onScroll,
        rowsCount: props.rowsCount,
    });

    React.useImperativeHandle(ref, () => scrollContainerRef.current, [scrollContainerRef.current]);

    const scrollShadows = useScrollShadows({ root: scrollContainerRef.current });

    const renderRows = () =>
        props.renderRows?.({ listContainerRef, estimatedHeight, offsetY, scrollShadows }) || (
            <div className={css.listContainer} style={{ minHeight: `${estimatedHeight}px` }}>
                <div ref={listContainerRef} role={props.role} style={{ marginTop: offsetY }}>
                    {props.rows}
                </div>
            </div>
        );

    const scrollBarsRef = React.useCallback((scrollbars: ScrollbarsApi) => {
        if (!scrollbars?.container?.firstChild) return;
        scrollContainerRef.current = scrollbars.container.firstChild as HTMLDivElement;
    }, []);

    return (
        <ScrollBars
            cx={cx(css.scrollContainer, props.cx)}
            onScroll={handleScroll}
            renderView={({ style, ...rest }: any) => (
                <div
                    style={{ ...style, position: 'relative', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}
                    className={cx({
                        [uuiMarkers.scrolledLeft]: scrollShadows.horizontalLeft,
                        [uuiMarkers.scrolledRight]: scrollShadows.horizontalRight,
                        [uuiMarkers.scrolledVertical]: scrollShadows.vertical,
                    })}
                    {...rest}
                    {...props.rawProps}
                />
            )}
            ref={scrollBarsRef}
        >
            {renderRows()}
        </ScrollBars>
    );
});

VirtualList.displayName = 'VirtualList';
