import React, { HTMLAttributes } from 'react';
import {
    IHasCX, IEditable, VirtualListState, IHasRawProps, useVirtualList, cx, UseVirtualListProps,
} from '@epam/uui-core';
import { Blocker, BlockerInset } from './Blocker';
import { ScrollBars } from './ScrollBars';
import type { ScrollbarsApi, ScrollbarProps } from './ScrollBars';

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
    Pick<UseVirtualListProps, 'rowsCount' | 'rowsSelector' | 'onScroll' | 'rowHeight' | 'rowGap'>,
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
        rowHeight: props.rowHeight,
        rowGap: props.rowGap,
    });

    React.useImperativeHandle(ref, () => scrollContainerRef.current, [scrollContainerRef.current]);

    const [blockerInset, setBlockerInset] = React.useState<BlockerInset | null>(null);

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

    const rawProps = React.useMemo(() => ({
        ...(props.rawProps ?? {}),
        style: {
            ...(props.rawProps?.style ?? {}),
            overflow: props.isLoading ? 'hidden' : props.rawProps?.style?.overflow,
        },
    }), [props.rawProps, props.isLoading]);

    const updateBlockerInset = React.useCallback(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const { scrollTop, scrollLeft } = scrollContainer;
        setBlockerInset({ top: scrollTop, left: scrollLeft, right: -scrollLeft, bottom: -scrollTop });
    }, [setBlockerInset]);

    React.useEffect(() => {
        if (props.isLoading) {
            updateBlockerInset();
        }
    }, [props.isLoading, updateBlockerInset]);

    return (
        <ScrollBars
            cx={ cx(css.scrollContainer, props.cx) }
            onScroll={ handleScroll }
            ref={ scrollBarsRef }
            rawProps={ rawProps }
            overflowTopEffect={ props.overflowTopEffect }
            overflowBottomEffect={ props.overflowBottomEffect }
            autoHide={ props.isLoading ? 'scroll' : undefined }
        >
            {renderRows()}
            <Blocker isEnabled={ props.isLoading } inset={ blockerInset } />
        </ScrollBars>
    );
});
