import * as React from "react";
import { DataColumnProps, IClickable, IHasCX, IHasRawProps, uuiMarkers, Link, cx } from "@epam/uui";
import { FlexRow } from '../layout';
import { Anchor } from '../navigation/Anchor';
import * as css from './DataTableRowContainer.scss';

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
                minWidth: column.minWidth || (typeof column.width === 'string' ? 0 : column.width)
            }, idx));
        }, []);
    }

    getSectionWidth = (cells: DataColumnProps<TItem, TId>[]) => {
        if (!cells || !Array.isArray(cells)) return 0;
        return cells.reduce((width, cell) => width + (typeof cell.width === 'string' ? 0 : cell.width), 0);
    }

    wrapFixedSection = (cells: DataColumnProps<TItem, TId>[], direction: 'left' | 'right') => (
        <div
            style={{ width: `${this.getSectionWidth(cells)}px` }}
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

    wrapScrollingSection = (cells: DataColumnProps<TItem, TId>[]) => {
        if (this.props.wrapScrollingSection) return this.props.wrapScrollingSection(cells);
        else return (
            <div style={{ flex: `1 0 ${this.getSectionWidth(cells)}px` }} className={ css.container }>
                { this.renderCells(cells) }
            </div>
        );
    }

    render() {
        const fixedLeftColumns: DataColumnProps<TItem, TId>[] = [];
        const fixedRightColumns: DataColumnProps<TItem, TId>[] = [];
        const staticColumns: DataColumnProps<TItem, TId>[] = [];

        this.props.columns?.forEach(i => {
            if (i.fix === 'left') fixedLeftColumns.push(i);
            else if (i.fix === 'right') fixedRightColumns.push(i);
            else staticColumns.push(i);
        });

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
                    alignItems='top'
                    rawProps={ this.props.rawProps }
                >
                    { rowContent }
                </FlexRow>
            )
        );
    }
}