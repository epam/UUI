import React, { HTMLAttributes, MutableRefObject, ReactNode } from 'react';
import { IHasCX, IEditable, VirtualListState, IHasRawProps, useVirtualList, useScrollShadows, cx, uuiMarkers } from '@epam/uui';
import { PositionValues, ScrollBars } from '@epam/uui-components';
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

export interface VirtualListProps<List extends HTMLElement = HTMLDivElement, ScrollContainer extends HTMLElement = HTMLDivElement> extends IHasCX, IEditable<VirtualListState>, IHasRawProps<ScrollContainer> {
    rows: ReactNode[];
    rowsCount?: number;
    role?: HTMLAttributes<HTMLDivElement>['role'];
    renderRows?: (config: RenderRowsConfig<List>) => React.ReactNode;
    focusedIndex?: number;
    onScroll?(value: PositionValues): void;
};

export function VirtualList(props: VirtualListProps) {
    const {
        listOffset,
        listContainer,
        offsetY,
        handleScroll,
        estimatedHeight,
        scrollContainer
    } = useVirtualList({
        value: props.value,
        onValueChange: props.onValueChange,
        onScroll: props.onScroll,
        rowsCount: props.rowsCount
    });

    const { verticalRef, horizontalRef, ...scrollShadows } = useScrollShadows({ root: scrollContainer.current });

    const renderRows = () => (
        props.renderRows?.({ listContainer, estimatedHeight, offsetY, scrollShadows }) || (
            <div className={ css.listContainer } style={{ minHeight: `${estimatedHeight}px` }}>
                <div
                    ref={ listContainer }
                    role={ props.role }
                    style={ { marginTop: offsetY }}
                    children={ props.rows }
                />
            </div>
        )
    );

    return (
        <ScrollBars
            cx={ css.scrollContainer }
            onScroll={ handleScroll }
            renderView={ ({ style, ...rest }) => (
                <div
                    style={ { ...style, position: 'relative', flex: '1 1 auto'} }
                    className={ cx(props.cx, {
                        [uuiMarkers.scrolledLeft]: scrollShadows.horizontalLeft,
                        [uuiMarkers.scrolledRight]: scrollShadows.horizontalRight
                    }) }
                    { ...rest }
                    { ...props.rawProps }
                />
            ) }
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