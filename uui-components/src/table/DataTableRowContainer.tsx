import * as React from "react";
import { DataColumnProps, IClickable, IHasCX, IHasRawProps, uuiMarkers, Link, cx } from "@epam/uui-core";
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

const uuiDataTableRowContainer = {
    uuiTableRowContainer: 'uui-table-row-container',
    uuiTableFixedSectionLeft: 'uui-table-fixed-section-left',
    uuiTableFixedSectionRight: 'uui-table-fixed-section-right',
    uuiScrollShadowLeft: 'uui-scroll-shadow-left',
    uuiScrollShadowRight: 'uui-scroll-shadow-right',
} as const;

export const DataTableRowContainer = React.forwardRef(<TItem, TId, TFilter>(props: DataTableRowContainerProps<TItem, TId, TFilter>, ref: React.ForwardedRef<HTMLDivElement>) => {
    function renderCells(columns: DataColumnProps<TItem, TId, TFilter>[]) {
        return columns.reduce<React.ReactNode[]>((cells, column) => {
            const idx = props.columns?.indexOf(column) || 0;
            cells.push(props.renderCell(column, idx));
            return cells;
        }, []);
    }

    function getSectionWidth(cells: DataColumnProps<TItem, TId, TFilter>[]) {
        return cells.reduce((width, cell) => width + (typeof cell.width !== 'number' ? (cell.minWidth || 0) : cell.width), 0);
    }
    function getSectionGrow(cells: DataColumnProps<TItem, TId, TFilter>[]) {
        return cells.reduce((grow, cell) => grow + (cell.grow || 0), 0);
    }

    function wrapFixedSection(cells: DataColumnProps<TItem, TId, TFilter>[], direction: 'left' | 'right') {
        return (
            <div
                style={ {
                    flex: `${getSectionGrow(cells)} 0 ${getSectionWidth(cells)}px`,
                    minWidth: `${getSectionWidth(cells)}px`,
                } }
                className={ cx({
                    [css.fixedColumnsSectionLeft]: direction === 'left',
                    [uuiDataTableRowContainer.uuiTableFixedSectionLeft]: direction === 'left',
                    [css.fixedColumnsSectionRight]: direction === 'right',
                    [uuiDataTableRowContainer.uuiTableFixedSectionRight]: direction === 'right',
                }) }>
                { renderCells(cells) }
                { direction === 'right' && <div className={ uuiDataTableRowContainer.uuiScrollShadowLeft } /> }
                { direction === 'left' && <div className={ uuiDataTableRowContainer.uuiScrollShadowRight } /> }
                { direction === 'right' && props.renderConfigButton?.() }
            </div>
        )
    };

    function wrapScrollingSection(cells: DataColumnProps<TItem, TId, TFilter>[]) {
        if (props.wrapScrollingSection) return props.wrapScrollingSection(cells);
        return (
            <div className={ css.container } style={ {
                flex: `${getSectionGrow(cells)} 0 ${getSectionWidth(cells)}px`,
                minWidth: `${getSectionWidth(cells)}px`,
            } }>
                { renderCells(cells) }
            </div>
        );
    }

    function getRowContent() {
        const fixedLeftColumns: DataColumnProps<TItem, TId, TFilter>[] = [];
        const fixedRightColumns: DataColumnProps<TItem, TId, TFilter>[] = [];
        const staticColumns: DataColumnProps<TItem, TId, TFilter>[] = [];

        for (const column of props.columns) {
            if (column.fix === 'left') fixedLeftColumns.push(column);
            else if (column.fix === 'right') fixedRightColumns.push(column);
            else staticColumns.push(column);
        }

        return (
            <>
                { fixedLeftColumns.length > 0 && wrapFixedSection(fixedLeftColumns, 'left') }
                { wrapScrollingSection(staticColumns) }
                { fixedRightColumns.length > 0 && wrapFixedSection(fixedRightColumns, 'right') }
                { props.overlays }
            </>
        );
    }

    return (
        props.link ? (
            <Anchor
                link={ props.link }
                cx={ [css.container, uuiDataTableRowContainer.uuiTableRowContainer, props.onClick && uuiMarkers.clickable, props.cx] }
                rawProps={ props.rawProps }
            >
                { getRowContent() }
            </Anchor>
        ) : (
            <FlexRow
                onClick={ props.onClick }
                cx={ [css.container, uuiDataTableRowContainer.uuiTableRowContainer, props.onClick && uuiMarkers.clickable, props.cx] }
                rawProps={ props.rawProps }
                ref={ ref }
            >
                { getRowContent() }
            </FlexRow>
        )
    )
});