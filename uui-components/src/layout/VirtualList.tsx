import React, { ReactNode } from 'react';
import { IHasCX, IEditable, VirtualListState, cx, IHasRawProps, useVirtualList, useScrollShadows } from '@epam/uui';
import { PositionValues, ScrollBars } from '@epam/uui-components';
import * as css from './VirtualList.scss';

export interface VirtualListProps extends IHasCX, IEditable<VirtualListState>, IHasRawProps<HTMLDivElement> {
    rows: ReactNode[];
    rowsCount?: number;
    focusedIndex?: number;
    onScroll?(value: PositionValues): void;
};

enum scrollShadowsCx {
    top = 'uui-scroll-shadow-top',
    topVisible = 'uui-scroll-shadow-top-visible',
    bottom = 'uui-scroll-shadow-bottom',
    bottomVisible = 'uui-scroll-shadow-bottom-visible'
};

export function VirtualList(props: VirtualListProps) {
    const { listRef, scrollbarsRef, offsetY, handleScroll, estimatedHeight } = useVirtualList<HTMLDivElement, HTMLDivElement>({
        value: props.value,
        onValueChange: props.onValueChange,
        onScroll: props.onScroll,
        rowsCount: props.rowsCount
    });

    const { verticalRef, ...scrollShadows } = useScrollShadows({
        root: scrollbarsRef.current?.container
    });

    const renderRows = () => {
        const firstChildRole = listRef.current?.firstElementChild.getAttribute('role');

        return (
            <div className={ css.listContainer } style={{ minHeight: `${estimatedHeight}px` }}>
                <div
                    ref={ listRef }
                    role={ firstChildRole === 'option' ? 'listbox' : firstChildRole === 'row' ? 'rowgroup' : undefined }
                    style={ { marginTop: offsetY } }>
                    { props.rows }
                </div>
            </div>
        );
    };

    return (
        <div className={ cx(css.wrapper, props.cx) } { ...props.rawProps }>
            <ScrollBars onScroll={ handleScroll } ref={ scrollbarsRef }>
                { renderRows() }
                <div className={ scrollShadowsCx.top } style={{ opacity: scrollShadows.vertical ? 1 : 0 }} />
                <div className={ scrollShadowsCx.bottom } style={{ opacity: scrollShadows.vertical ? 1 : 0 }} />
                <div ref={ verticalRef } className={ css.verticalIntersectingRect } />
            </ScrollBars>
        </div>
    );
}