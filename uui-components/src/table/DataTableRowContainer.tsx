import * as React from "react";
import { DataColumnProps, IClickable, IHasCX, IHasRawProps, uuiMarkers, Link, cx } from "@epam/uui";
import { FlexRow } from '../layout';
import * as css from './DataTableRowContainer.scss';
import { Anchor } from '../navigation/Anchor';

export interface DataTableRowContainerProps<TItem, TId> extends IClickable, IHasCX, IHasRawProps<HTMLAnchorElement | HTMLDivElement> {
    columns?: DataColumnProps<TItem, TId>[];
    renderCell?(column: DataColumnProps<TItem, TId>, idx: number): React.ReactNode;
    wrapScrollingSection?(content: React.ReactNode): React.ReactNode;
    renderConfigButton?(): React.ReactNode;
    overlays?: React.ReactNode;
    link?: Link;
}

enum uuiDataTableRowContainer {
    uuiTableRowContainer = 'uui-table-row-container',
    uuiTableFixedSectionLeft = 'uui-table-fixed-section-left',
    uuiTableFixedSectionRight = 'uui-table-fixed-section-right',
    uuiScrollShadowLeft = 'uui-scroll-shadow-left',
    uuiScrollShadowRight = 'uui-scroll-shadow-right'
};

export class DataTableRowContainer<TItem, TId> extends React.Component<DataTableRowContainerProps<TItem, TId>, {}> {
    protected renderCells(columns: DataColumnProps<TItem, TId>[]) {
        return columns.reduce<React.ReactNode[]>((cells, column) => {
            const idx = this.props.columns?.indexOf(column) || 0;
            return cells.concat(this.props.renderCell({
                ...column,
                minWidth: column.minWidth || typeof column.width === 'string' ? undefined : column.width,
            }, idx));
        }, []);
    }

    wrapFixedSection = (columns: DataColumnProps<TItem, TId>[], direction: 'left' | 'right') => {
        const width = columns.reduce((acc, column) => acc + (typeof column.width === 'string' ? 0 : column.width), 0);
        return (
            <div
                style={{ flex: `0 0 ${width}px` }}
                className={ cx({
                    [css.fixedColumnsSectionLeft]: direction === 'left',
                    [uuiDataTableRowContainer.uuiTableFixedSectionLeft]: direction === 'left',
                    [css.fixedColumnsSectionRight]: direction === 'right',
                    [uuiDataTableRowContainer.uuiTableFixedSectionRight]: direction === 'right',
                })}>
                    <div className={ css.container }>
                        { this.renderCells(columns) }
                        { direction === 'right' && <div className={ uuiDataTableRowContainer.uuiScrollShadowLeft } /> }
                        { direction === 'left' && <div className={ uuiDataTableRowContainer.uuiScrollShadowRight } /> }
                    </div>
            </div>
        )
    }

    render() {
        const fixedLeftColumns: DataColumnProps<TItem, TId>[] = [];
        const fixedRightColumns: DataColumnProps<TItem, TId>[] = [];
        const scrollableColumns: DataColumnProps<TItem, TId>[] = [];

        this.props.columns?.forEach(i => {
            if (i.fix === 'left') fixedLeftColumns.push(i);
            else if (i.fix === 'right') fixedRightColumns.push(i);
            else scrollableColumns.push(i);
        });

        const cells = (
            this.props.wrapScrollingSection?.(this.renderCells(scrollableColumns)) ||
            this.renderCells(scrollableColumns)
        );

        const rowContent = (
            <>
                { this.wrapFixedSection(fixedLeftColumns, 'left') }
                <div className={ css.staticCells }>
                    { cells }
                </div>
                { this.wrapFixedSection(fixedRightColumns, 'right') }
                { this.props.renderConfigButton?.() }
                { this.props.overlays }
            </>
        );

        return (
            this.props.link ? (
                <Anchor
                    link={ this.props.link }
                    cx={ [css.container, uuiDataTableRowContainer.uuiTableRowContainer, this.props.onClick && uuiMarkers.clickable, this.props.cx] }
                    rawProps={ this.props.rawProps }
                >
                    { rowContent }
                </Anchor>
            ) : (
                <FlexRow
                    onClick={ this.props.onClick }
                    cx={ [css.container, uuiDataTableRowContainer.uuiTableRowContainer, this.props.onClick && uuiMarkers.clickable, this.props.cx] }
                    rawProps={ this.props.rawProps }
                    alignItems='top'
                >
                    { rowContent }
                </FlexRow>
            )
        );
    }
}