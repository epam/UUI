import React, { HTMLAttributes, MutableRefObject, ReactNode } from 'react';
import { IHasCX, IEditable, VirtualListState, IHasRawProps, useVirtualList, cx, useScrollShadows, uuiScrollShadows } from '@epam/uui';
import { PositionValues, ScrollBars } from '@epam/uui-components';
import * as css from './VirtualList.scss';

export interface RenderRowsConfig {
    listContainer: MutableRefObject<HTMLDivElement>;
    estimatedHeight: number;
    role: HTMLAttributes<HTMLDivElement>['role'];
    offsetY: number;
    scrollShadows: {
        vertical: boolean;
        horizontalLeft: boolean;
        horizontalRight: boolean;
    };
};

export interface VirtualListProps extends IHasCX, IEditable<VirtualListState>, IHasRawProps<HTMLDivElement> {
    rows: ReactNode[];
    rowsCount?: number;
    renderRows?: (config: RenderRowsConfig) => React.ReactNode;
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
    } = useVirtualList<HTMLDivElement, HTMLDivElement>({
        value: props.value,
        onValueChange: props.onValueChange,
        onScroll: props.onScroll,
        rowsCount: props.rowsCount
    });

    const { verticalRef, horizontalRef, ...scrollShadows } = useScrollShadows({ root: scrollContainer?.api?.container });

    // Recognize role of the list by children role
    const childRole = listContainer.current?.firstElementChild?.getAttribute('role');
    const role = childRole === 'option' ? 'listbox' : childRole === 'row' ? 'rowgroup' : undefined;

    const renderRows = () => (
        props.renderRows?.({ listContainer, estimatedHeight, role, offsetY, scrollShadows }) || (
            <div className={ css.listContainer } style={{ minHeight: `${estimatedHeight}px` }}>
                <div ref={ listContainer } role={ role } style={ { marginTop: offsetY } } children={ props.rows } />
            </div>
        )
    );

    return (
        <ScrollBars onScroll={ handleScroll } ref={ scrollbars => scrollContainer.setRef(scrollbars?.container?.firstChild as HTMLDivElement) }>
            <div style={{ top: `${listOffset}px` }} ref={ verticalRef } className={ uuiScrollShadows.verticalIntersectingRect } />
            <div className={ cx(css.wrapper, props.cx) } >
                { renderRows() }
            </div>
            <div style={{ bottom: `${listOffset}px` }} ref={ horizontalRef } className={ uuiScrollShadows.horizontalIntersectingRect } />
        </ScrollBars>
    );
}