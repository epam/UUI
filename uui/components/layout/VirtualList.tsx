import React, { HTMLAttributes } from 'react';
import {
    IHasCX, IEditable, VirtualListState, IHasRawProps, useVirtualList, cx, UseVirtualListProps,
} from '@epam/uui-core';
import { ScrollbarsApi, ScrollbarProps } from '@epam/uui-components';
import { ScrollBars } from './ScrollBars';
import { Blocker } from './Blocker';
import css from './VirtualList.module.scss';

export interface VirtualListRenderRowsParams<ListContainer extends HTMLElement = any> {
    listContainerRef: React.MutableRefObject<ListContainer>;
    estimatedHeight: number;
    offsetY: number;
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
    IHasRawProps<HTMLAttributes<HTMLDivElement>>,
    Pick<UseVirtualListProps, 'rowsCount' | 'rowsSelector' | 'onScroll'>,
    Pick<ScrollbarProps, 'overflowTopEffect' | 'overflowBottomEffect'> {
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

    const renderRows = () =>
        props.renderRows?.({
            listContainerRef, estimatedHeight, offsetY,
        }) || (
            <div className={ css.listContainer } style={ { minHeight: `${estimatedHeight}px` } }>
                <div ref={ listContainerRef } role={ props.role } style={ { marginTop: offsetY } }>
                    {props.rows}
                </div>
            </div>
        );

    const scrollBarsRef = React.useCallback((scrollbars: ScrollbarsApi) => {
        if (!scrollbars?.view) return;
        scrollContainerRef.current = scrollbars.view;
    }, []);

    return (
        <ScrollBars
            cx={ cx(css.scrollContainer, props.cx) }
            onScroll={ handleScroll }
            ref={ scrollBarsRef }
            rawProps={ props.rawProps }
            overflowTopEffect={ props.overflowTopEffect }
            overflowBottomEffect={ props.overflowBottomEffect }
        >
            {renderRows()}
            <Blocker isEnabled={ props.isLoading } />
        </ScrollBars>
    );
});
