import * as React from "react";
import { DataColumnProps, IClickable, IHasCX, IHasRawProps, uuiMarkers, Link, cx } from "@epam/uui";
import { FlexRow } from '../layout';
import { Anchor } from '../navigation/Anchor';
import * as css from './DataTableRowContainer.scss';

export interface DataTableRowContainerProps<TItem, TId, TFilter> extends IClickable, IHasCX, IHasRawProps<HTMLAnchorElement | HTMLDivElement> {
    columns?: DataColumnProps<TItem, TId, TFilter>[];
    renderCell?(column: DataColumnProps<TItem, TId, TFilter>, idx: number): React.ReactNode;
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
    uuiScrollShadowRight = 'uui-scroll-shadow-right',
};

export class DataTableRowContainer<TItem, TId, TFilter> extends React.Component<DataTableRowContainerProps<TItem, TId, TFilter>> {
    protected renderCells(columns: DataColumnProps<TItem, TId, TFilter>[]) {
        return columns.reduce<React.ReactNode[]>((cells, column) => {
            const idx = this.props.columns?.indexOf(column) || 0;
            return cells.concat(this.props.renderCell({
                ...column,
                minWidth: column.minWidth || (typeof column.width !== 'number' ? 0 : column.width),
            }, idx));
        }, []);
    }

    getSectionWidth = (cells: DataColumnProps<TItem, TId, TFilter>[]) => {
        return cells.reduce((width, cell) => width + (typeof cell.width !== 'number' ? (cell.minWidth || 0) : cell.width), 0);
    }

    wrapFixedSection = (cells: DataColumnProps<TItem, TId, TFilter>[], direction: 'left' | 'right') => (
        <div
            style={ { flex: `0 0 ${this.getSectionWidth(cells)}px` } }
            className={ cx({
                [css.fixedColumnsSectionLeft]: direction === 'left',
                [uuiDataTableRowContainer.uuiTableFixedSectionLeft]: direction === 'left',
                [css.fixedColumnsSectionRight]: direction === 'right',
                [uuiDataTableRowContainer.uuiTableFixedSectionRight]: direction === 'right',
            })}>
            { this.renderCells(cells) }
            { direction === 'right' && <div className={ uuiDataTableRowContainer.uuiScrollShadowLeft } /> }
            { direction === 'left' && <div className={ uuiDataTableRowContainer.uuiScrollShadowRight } /> }
            { direction === 'right' && this.props.renderConfigButton?.() }
        </div>
    );

    wrapScrollingSection = (cells: DataColumnProps<TItem, TId, TFilter>[]) => {
        if (this.props.wrapScrollingSection) return this.props.wrapScrollingSection(cells);
        return (
            <div className={ css.container } style={{
                flex: `1 0 ${this.getSectionWidth(cells)}px`,
                minWidth: `${this.getSectionWidth(cells)}px`
            }}>
                { this.renderCells(cells) }
            </div>
        );
    }

    render() {
        const fixedLeftColumns: DataColumnProps<TItem, TId, TFilter>[] = [];
        const fixedRightColumns: DataColumnProps<TItem, TId, TFilter>[] = [];
        const staticColumns: DataColumnProps<TItem, TId, TFilter>[] = [];

        for (const column of this.props.columns) {
            if (column.fix === 'left') fixedLeftColumns.push(column);
            else if (column.fix === 'right') fixedRightColumns.push(column);
            else staticColumns.push(column);
        };

        const rowContent = (
            <>
                { fixedLeftColumns.length > 0 && this.wrapFixedSection(fixedLeftColumns, 'left') }
                { this.wrapScrollingSection(staticColumns) }
                { fixedRightColumns.length > 0 && this.wrapFixedSection(fixedRightColumns, 'right') }
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
                >
                    { rowContent }
                </FlexRow>
            )
        );
    }
}