import * as React from 'react';
import {
    IHasCX, IEditable, VirtualListState, IHasRawProps, useVirtualList, useScrollShadows, cx, uuiMarkers, IHasChildren, UseVirtualListProps,
} from '@epam/uui-core';
import { ScrollbarsApi } from '@epam/uui-components';
import { ScrollBars } from './ScrollBars';
import css from './VirtualList.module.scss';
import { Blocker } from './Blocker';
import { HTMLAttributes } from 'react';

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
}

export type VirtualListProps<List extends HTMLElement = any> = BaseVirtualListProps & VirtualListRenderRows<List>;

export const VirtualList = /* @__PURE__ */React.forwardRef<ScrollbarsApi, VirtualListProps>((props, ref) => {
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

    const renderView = ({ style }: any) => (
        <VirtualListView
            isLoading={ props.isLoading }
            style={ style }
            rawProps={ props.rawProps }
        />
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
            renderView={ renderView }
            ref={ scrollBarsRef }
        >
            {renderRows()}
        </ScrollBars>
    );
});

interface VirtualListViewProps extends IHasRawProps<HTMLAttributes<HTMLDivElement>>, IHasChildren {
    style?: React.CSSProperties;
    isLoading: boolean;
}

const VirtualListView = /* @__PURE__ */React.forwardRef<HTMLDivElement, VirtualListViewProps>((props, ref) => {
    return (
        <>
            <div
                { ...props.rawProps }
                style={ {
                    ...props.style,
                    position: 'relative',
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: props.isLoading ? 'hidden' : 'scroll',
                    marginRight: props.isLoading ? 0 : props.style.marginRight,
                    marginBottom: props.isLoading ? 0 : props.style.marginBottom,
                } }
                ref={ ref }
            >
                { props.children }
            </div>
            <Blocker isEnabled={ props.isLoading } />
        </>
    );
});

VirtualList.displayName = 'VirtualList';
