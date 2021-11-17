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
            return cells.concat(this.props.renderCell(column, idx));
        }, []);
    }

    wrapFixedSection = (cells: DataColumnProps<TItem, TId>[], direction: 'left' | 'right') => (
        <div
            className={ cx({
                [css.fixedColumnsSectionLeft]: direction === 'left',
                [uuiDataTableRowContainer.uuiTableFixedSectionLeft]: direction === 'left',
                [css.fixedColumnsSectionRight]: direction === 'right',
                [uuiDataTableRowContainer.uuiTableFixedSectionRight]: direction === 'right',
            })}>
            { this.renderCells(cells) }
            { direction === 'right' && <div className={ uuiDataTableRowContainer.uuiScrollShadowLeft } /> }
            { direction === 'left' && <div className={ uuiDataTableRowContainer.uuiScrollShadowRight } /> }
        </div>
    );

    wrapScrollingSection = (cells: DataColumnProps<TItem, TId>[]) => (
        <div className={ css.container }>
            { this.renderCells(cells) }
        </div>
    );

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
                { this.renderCells(fixedLeftColumns) }
                { this.renderCells(staticColumns) }
                { this.renderCells(fixedRightColumns) }
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
                >
                    { rowContent }
                </FlexRow>
            )
        );
    }
}