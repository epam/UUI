import React, { HTMLAttributes } from 'react';
import {
    IHasCX, IEditable, VirtualListState, IHasRawProps, useVirtualList, useScrollShadows, cx, uuiMarkers, UseVirtualListProps,
} from '@epam/uui-core';
import { ScrollbarsApi } from '@epam/uui-components';
import { ScrollBars } from './ScrollBars';
import { Blocker } from './Blocker';
import css from './VirtualList.module.scss';

export interface VirtualListRenderRowsParams<ListContainer extends HTMLElement = any> {
    listContainerRef: React.MutableRefObject<ListContainer>;
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

interface BaseVirtualListProps
    extends IHasCX,
    IEditable<VirtualListState>,
    IHasRawProps<HTMLAttributes<HTMLDivElement>>, Pick<UseVirtualListProps, 'rowsCount' | 'rowsSelector' | 'onScroll'> {
    /** HTML role attribute to place on list container */
    role?: React.HTMLAttributes<HTMLDivElement>['role'];
    /** Pass true, to enable Blocker while list loading */
    isLoading?: boolean;
    /**
     * Render callback for virtual list loading blocker
     * If omitted, default UUI `Blocker` component will be rendered
     */
    renderBlocker?: (props: { isLoading: boolean }) => React.ReactNode;
}

export type VirtualListProps<List extends HTMLElement = any> = BaseVirtualListProps & VirtualListRenderRows<List>;

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
        if (!scrollbars?.view) return;
        scrollContainerRef.current = scrollbars.view as HTMLDivElement;
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
            ref={ scrollBarsRef }
            rawProps={ props.rawProps }
        >
            {renderRows()}
            <Blocker isEnabled={ props.isLoading } />
        </ScrollBars>
    );
});
