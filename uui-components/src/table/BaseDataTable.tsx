import React from 'react';
import {
    IEditable, DataTableState, DataSourceListProps, DataTableColumnsConfigOptions, DataRowProps, DataColumnProps,
    uuiMarkers, useTableShadows, cx, useVirtual, CX, useColumnsConfig
} from '@epam/uui';
import { PositionValues, ScrollBars } from '@epam/uui-components';
import * as css from './BaseDataTable.scss';

export interface BaseDataTableProps<TItem, TId> extends CX, IEditable<DataTableState>, DataSourceListProps, DataTableColumnsConfigOptions {
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

export function BaseDataTable<TItem, TId>({
    rowsCount,
    value,
    onValueChange,
    onScroll,
    ...props
}: React.PropsWithChildren<BaseDataTableProps<TItem, TId>>) {
    const { columns } = useColumnsConfig(props.columns, props.value?.columnsConfig);
    const { listRef, scrollbarsRef, estimatedHeight, offsetY, handleScroll } = useVirtual<HTMLDivElement>({
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
                    [uuiMarkers.scrolledLeft]: scrollShadows.horizontal,
                    [uuiMarkers.scrolledRight]: scrollShadows.horizontal
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