import React, { HTMLAttributes, MutableRefObject, ReactNode } from 'react';
import { IHasCX, IEditable, VirtualListState, IHasRawProps, useVirtualList, cx, useScrollShadows } from '@epam/uui';
import { PositionValues, ScrollbarsApi, ScrollBars } from '@epam/uui-components';
import * as css from './VirtualList.scss';

export interface RenderRowsConfig<List extends HTMLElement = HTMLDivElement> {
    listContainer: MutableRefObject<List>;
    estimatedHeight: number;
    offsetY: number;
    scrollShadows: {
        vertical: boolean;
        horizontalLeft: boolean;
        horizontalRight: boolean;
    };
};

export interface VirtualListProps<List extends HTMLElement = HTMLDivElement> extends IHasCX, IEditable<VirtualListState>, IHasRawProps<ScrollbarsApi> {
    rows: ReactNode[];
    rowsCount?: number;
    role?: HTMLAttributes<HTMLDivElement>['role'];
    renderRows?: (config: RenderRowsConfig<List>) => React.ReactNode;
    focusedIndex?: number;
    onScroll?(value: PositionValues): void;
};

export function VirtualList<List extends HTMLElement = HTMLDivElement>(props: VirtualListProps<List>) {
    const {
        listOffset,
        listContainer,
        offsetY,
        handleScroll,
        estimatedHeight,
        scrollContainer
    } = useVirtualList<List>({
        value: props.value,
        onValueChange: props.onValueChange,
        onScroll: props.onScroll,
        rowsCount: props.rowsCount
    });

    const { verticalRef, horizontalRef, ...scrollShadows } = useScrollShadows({ root: scrollContainer.current });

    const renderRows = () => (
        props.renderRows?.({ listContainer, estimatedHeight, offsetY, scrollShadows }) || (
            <div
                ref={ listContainer as unknown as MutableRefObject<HTMLDivElement> }
                role={ props.role }
                style={ { marginTop: offsetY, minHeight: `${estimatedHeight}px` } }
                children={ props.rows }
            />
        )
    );

    return (
        <ScrollBars
            cx={ cx(css.scrollContainer, props.cx) }
            onScroll={ handleScroll }
            rawProps={ props.rawProps }
            ref={ scrollbars => {
                if (!scrollbars?.container?.firstChild) return;
                scrollContainer.current = scrollbars.container.firstChild as HTMLDivElement;
            } }
        >
            <div style={{ top: `${listOffset}px` }} ref={ verticalRef } className={ css.verticalIntersectingRect } />
            { renderRows() }
            <div style={{ bottom: `${listOffset}px` }} ref={ horizontalRef } className={ css.horizontalIntersectingRect } />
        </ScrollBars>
    );
}