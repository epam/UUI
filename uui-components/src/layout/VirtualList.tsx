import React, { ReactNode } from 'react';
import { IHasCX, IEditable, VirtualListState, cx, IHasRawProps, useVirtual } from '@epam/uui';
import { PositionValues, ScrollBars } from '@epam/uui-components';
import * as css from './VirtualList.scss';

export interface VirtualListProps extends IHasCX, IEditable<VirtualListState>, IHasRawProps<HTMLDivElement> {
    rows: ReactNode[];
    rowsCount?: number;
    focusedIndex?: number;
    onScroll?(value: PositionValues): void;
};

export function VirtualList({
    onValueChange,
    onScroll,
    focusedIndex,
    value,
    rows,
    rowsCount,
    rawProps,
    ...props
}: VirtualListProps) {
    const {
        listRef,
        scrollbarsRef,
        estimatedHeight,
        offsetY,
        handleScroll
    } = useVirtual<HTMLDivElement>({ value, onValueChange, onScroll, rowsCount, focusedIndex });

    const renderRows = () => {
        const firstChildRole = listRef.current?.children?.[0]?.getAttribute('role');

        return (
            <div
                ref={ listRef }
                role={ firstChildRole === 'option' ? 'listbox' : firstChildRole === 'row' ? 'rowgroup' : undefined }
                className={ css.listContainer }
                style={ { marginTop: offsetY } }>
                { rows }
            </div>
        );
    };

    return (
        <div className={ cx(css.wrapper, props.cx) } { ...rawProps }>
            <ScrollBars
                autoHeight
                className={ css.body }
                onScroll={ handleScroll }
                hideTracksWhenNotNeeded
                ref={ scrollbarsRef }
                autoHeightMax={ 100500 }
            >
                <div className={ css.listWrapperContainer } style={ { minHeight: `${estimatedHeight}px` } }>
                    { renderRows() }
                </div>
            </ScrollBars>
        </div>
    );
}