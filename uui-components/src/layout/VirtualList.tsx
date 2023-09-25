import * as React from 'react';
import {
    IHasCX, IEditable, VirtualListState, IHasRawProps, useVirtualList, useScrollShadows, cx, uuiMarkers,
} from '@epam/uui-core';
import { PositionValues, ScrollBars, ScrollbarsApi } from './ScrollBars';
import css from './VirtualList.module.scss';

export interface VirtualListRenderRowsParams<List extends HTMLElement = any> {
    listContainerRef: React.MutableRefObject<List>;
    estimatedHeight: number;
    offsetY: number;
    scrollShadows: {
        verticalTop: boolean;
        verticalBottom: boolean;
        horizontalLeft: boolean;
        horizontalRight: boolean;
    };
}
type VirtualListRenderRows<List extends HTMLElement = any> = {
    rows?: React.ReactNode[];
    renderRows: (config: VirtualListRenderRowsParams<List>) => React.ReactNode;
} | {
    rows: React.ReactNode[];
    renderRows?: (config: VirtualListRenderRowsParams<List>) => React.ReactNode;
};

interface BaseVirtualListProps<ScrollContainer extends HTMLElement = any>
    extends IHasCX,
    IEditable<VirtualListState>,
    IHasRawProps<ScrollContainer> {
    rowsCount?: number;
    role?: React.HTMLAttributes<HTMLDivElement>['role'];
    onScroll?(value: PositionValues): void;
    rowsSelector?: string;
    disableScroll?: boolean;
}

export type VirtualListProps<
    List extends HTMLElement = any,
    ScrollContainer extends HTMLElement = any
> = BaseVirtualListProps<ScrollContainer> & VirtualListRenderRows<List>;

export const VirtualList = React.forwardRef<ScrollbarsApi, VirtualListProps>((props, ref) => {
    const {
        listContainerRef, offsetY, handleScroll, estimatedHeight, scrollContainerRef,
    } = useVirtualList({
        value: props.value,
        onValueChange: props.onValueChange,
        onScroll: props.onScroll,
        rowsCount: props.rowsCount,
        rowsSelector: props.rowsSelector,
    });

    React.useImperativeHandle(ref, () => scrollContainerRef.current, [scrollContainerRef.current]);

    const scrollShadows = useScrollShadows({ root: scrollContainerRef.current });

    const renderRows = () =>
        props.renderRows?.({
            listContainerRef, estimatedHeight, offsetY, scrollShadows,
        }) || (
            <div className={ css.listContainer } style={ { minHeight: `${estimatedHeight}px` } }>
                <div ref={ listContainerRef } role={ props.role } style={ { marginTop: offsetY } }>
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
            cx={ cx(css.scrollContainer, props.cx, {
                [uuiMarkers.scrolledLeft]: scrollShadows.horizontalLeft,
                [uuiMarkers.scrolledRight]: scrollShadows.horizontalRight,
                [uuiMarkers.scrolledTop]: scrollShadows.verticalTop,
                [uuiMarkers.scrolledBottom]: scrollShadows.verticalBottom,
            }) }
            onScroll={ handleScroll }
            disableScroll={ props.disableScroll }
            renderView={ ({ style, ...rest }: any) => (
                <div
                    style={ {
                        ...style, 
                        position: 'relative', 
                        flex: '1 1 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        ...(props.disableScroll ? {
                            position: 'static',
                            overflowY: 'auto',
                        } : {}),
                    } }
                    { ...rest }
                    { ...props.rawProps }
                />
            ) }
            ref={ scrollBarsRef }
        >
            {renderRows()}
        </ScrollBars>
    );
});

VirtualList.displayName = 'VirtualList';
