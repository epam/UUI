import React from 'react';
import {
    IEditable, DataTableState, DataSourceListProps, DataTableColumnsConfigOptions, DataRowProps, DataColumnProps,
    uuiMarkers, useTableShadows, cx, useVirtualList, CX,
} from '@epam/uui';
import { PositionValues, ScrollBars } from '@epam/uui-components';
import * as css from './DataTable.scss';

export interface DataTableProps<TItem, TId> extends CX, IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
    getRows(): DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
    renderNoResultsBlock?(): React.ReactNode;
    onScroll?(value: PositionValues): void;
    showColumnsConfig?: boolean;
    onConfigurationButtonClick?: () => void;
    renderHeader?: () => React.ReactNode;
};

enum scrollShadowsCx {
    top = 'uui-scroll-shadow-top',
    topVisible = 'uui-scroll-shadow-top-visible',
    bottom = 'uui-scroll-shadow-bottom',
    bottomVisible = 'uui-scroll-shadow-bottom-visible'
};

export function DataTable<TItem, TId>({
    rowsCount,
    value,
    onValueChange,
    onScroll,
    columns,
    ...props
}: React.PropsWithChildren<DataTableProps<TItem, TId>>) {
    const { listRef, scrollbarsRef, estimatedHeight, offsetY, handleScroll } = useVirtualList<HTMLDivElement>({
        value,
        onValueChange,
        onScroll,
        rowsCount
    });

    const { verticalRef, horizontalRef, ...scrollShadows } = useTableShadows({
        root: scrollbarsRef.current?.container
    });

    const renderTopShadow = () => (!props.shadow || props.shadow === 'dark') && (
        <div className={ cx(scrollShadowsCx.top, {
            [scrollShadowsCx.topVisible]: scrollShadows.vertical
        }) } />
    );

    const renderBottomShadow = () => props.shadow === 'white' && (
        <div className={ cx(scrollShadowsCx.bottom, {
            [scrollShadowsCx.bottomVisible]: scrollShadows.vertical
        }) } />
    );

    const getVirtualisedList = () => {
        const rows = props.getRows().map(row => props.renderRow({ ...row, columns }));

        return (
            <div
                ref={ listRef }
                role='rowgroup'
                className={ css.listContainer }
                style={ { marginTop: offsetY, minHeight: `${estimatedHeight}px` } }>
                { rows }
                { renderBottomShadow() }
            </div>
        );
    };

    return (
        <ScrollBars ref={ scrollbarsRef } onScroll={ handleScroll }>
            <div
                role="table"
                aria-colcount={ columns.length }
                aria-rowcount={ rowsCount }
                className={ cx(props.cx, {
                    [uuiMarkers.scrolledLeft]: scrollShadows.horizontalLeft,
                    [uuiMarkers.scrolledRight]: scrollShadows.horizontalRight
                }) }
            >
                <div className={ css.stickyHeader }>
                    { props.renderHeader?.() }
                    { renderTopShadow() }
                </div>
                <div ref={ verticalRef } className={ css.verticalIntersectingRect } />
                <div ref={ horizontalRef } className={ css.horizontalIntersectingRect } />
                { props.exactRowsCount !== 0 ? getVirtualisedList() : props.renderNoResultsBlock?.() }
            </div>
        </ScrollBars>
    )
}