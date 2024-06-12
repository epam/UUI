import React from 'react';
import {
    DataColumnProps, IClickable, IHasCX, IHasRawProps, uuiMarkers, Link, cx,
    DndEventHandlers,
} from '@epam/uui-core';
import { FlexRow } from '../layout';
import { Anchor } from '../navigation';
import css from './DataTableRowContainer.module.scss';

export interface DataTableRowContainerProps<TItem, TId, TFilter>
    extends IClickable,
    IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>> {
    columns?: DataColumnProps<TItem, TId, TFilter>[];
    renderCell?(column: DataColumnProps<TItem, TId, TFilter>, idx: number, eventHandlers?: DndEventHandlers): React.ReactNode;
    renderConfigButton?(): React.ReactNode;
    overlays?: React.ReactNode;
    link?: Link;
    eventHandlers?: DndEventHandlers;
}

const uuiDataTableRowCssMarkers = {
    uuiTableRowContainer: 'uui-table-row-container',
    uuiTableFixedSection: 'uui-table-fixed-section',
    uuiTableScrollingSection: 'uui-table-scrolling-section',
    uuiTableFixedSectionLeft: 'uui-table-fixed-section-left',
    uuiTableFixedSectionRight: 'uui-table-fixed-section-right',
    uuiScrollShadowLeft: 'uui-scroll-shadow-left',
    uuiScrollShadowRight: 'uui-scroll-shadow-right',
} as const;

const CELL_BORDER_WIDTH = 1;

// Scrolling/Fixed sections wrappers, as well as the whole row itself, has to have matching flex-item parameters.
// This is required to have the same width, as the sum of column's width, and grow in the same proportion, as columns inside.
// E.g. for 2 columns: { width: 100, grow: 0 }, { width: 200, grow: 1 } we compute { width: 300, grow: 1 }
// For scrollingSection and for the whole table, we put at least grow=1 - to make the table occupy full width, even if there's no columns with grow > 0.
function getSectionStyle(columns: DataColumnProps[], minGrow = 0) {
    let grow = 0;
    let width = 0;

    columns.forEach((column) => {
        const columnWidth = typeof column.width === 'number' ? (column.fix ? column.width : column.width - CELL_BORDER_WIDTH) : column.minWidth || 0; // (column.width - CELL_BORDER_WIDTH) do not forget the negative margin of the scrolling columns in the calculation of the width
        width += columnWidth;
        grow += typeof column.grow === 'number' ? column.grow : 0;
    });

    grow = Math.max(grow, minGrow);

    return {
        flex: `${grow} 0 ${width}px`,
        minWidth: `${width}px`,
        '--uui-dt-cell-border-width': `${CELL_BORDER_WIDTH}px`,
    };
}

export const DataTableRowContainer = React.forwardRef(
    <TItem, TId, TFilter>(props: DataTableRowContainerProps<TItem, TId, TFilter>, ref: React.ForwardedRef<HTMLDivElement>) => {
        function renderCells(columns: DataColumnProps<TItem, TId, TFilter>[]) {
            const { onPointerUp, onPointerDown, onTouchStart } = props.eventHandlers ?? {};
            return columns.reduce<React.ReactNode[]>((cells, column) => {
                const idx = props.columns?.indexOf(column) || 0;
                cells.push(props.renderCell(column, idx, { onPointerUp, onPointerDown, onTouchStart }));
                return cells;
            }, []);
        }

        function wrapFixedSection(columns: DataColumnProps<TItem, TId, TFilter>[], direction: 'left' | 'right', hasScrollingSection: boolean) {
            return (
                <div
                    style={ getSectionStyle(columns) }
                    className={ cx({
                        [css.section]: true,
                        [uuiDataTableRowCssMarkers.uuiTableFixedSection]: true,
                        [css.fixedColumnsSectionLeft]: direction === 'left',
                        [uuiDataTableRowCssMarkers.uuiTableFixedSectionLeft]: direction === 'left',
                        [css.fixedColumnsSectionRight]: direction === 'right',
                        [uuiDataTableRowCssMarkers.uuiTableFixedSectionRight]: direction === 'right',
                    }) }
                >
                    {renderCells(columns)}
                    {hasScrollingSection && direction === 'right' && <div className={ uuiDataTableRowCssMarkers.uuiScrollShadowLeft } />}
                    {hasScrollingSection && direction === 'left' && <div className={ uuiDataTableRowCssMarkers.uuiScrollShadowRight } />}
                    {direction === 'right' && props.renderConfigButton && props.renderConfigButton()}
                </div>
            );
        }

        function wrapScrollingSection(columns: DataColumnProps<TItem, TId, TFilter>[]) {
            return (
                <div className={ cx(css.section, css.scrollingSection, uuiDataTableRowCssMarkers.uuiTableScrollingSection) } style={ getSectionStyle(columns, 1) }>
                    {renderCells(columns)}
                </div>
            );
        }

        function getRowContent() {
            const fixedLeftColumns: DataColumnProps<TItem, TId, TFilter>[] = [];
            const fixedRightColumns: DataColumnProps<TItem, TId, TFilter>[] = [];
            const scrollingColumns: DataColumnProps<TItem, TId, TFilter>[] = [];

            for (const column of props.columns) {
                if (column.fix === 'left') fixedLeftColumns.push(column);
                else if (column.fix === 'right') fixedRightColumns.push(column);
                else scrollingColumns.push(column);
            }

            const hasScrollingSection = scrollingColumns.length > 0;

            return (
                <>
                    {fixedLeftColumns.length > 0 && wrapFixedSection(fixedLeftColumns, 'left', hasScrollingSection)}
                    {wrapScrollingSection(scrollingColumns)}
                    {fixedRightColumns.length > 0 && wrapFixedSection(fixedRightColumns, 'right', hasScrollingSection)}
                    {props.overlays}
                </>
            );
        }

        // We use only total minWidth here, grow is not needed (rows are placed in block or vertical flex contexts)
        const minWidth = getSectionStyle(props.columns, 1).minWidth;

        const rawProps = {
            ...props.rawProps,
            style: { ...props?.rawProps?.style, minWidth },
        };

        return props.link ? (
            <Anchor
                link={ props.link }
                cx={ [
                    css.container, uuiDataTableRowCssMarkers.uuiTableRowContainer, props.onClick && uuiMarkers.clickable, props.cx,
                ] }
                rawProps={ rawProps }
            >
                {getRowContent()}
            </Anchor>
        ) : (
            <FlexRow
                onClick={ props.onClick }
                cx={ [
                    css.container, uuiDataTableRowCssMarkers.uuiTableRowContainer, props.onClick && uuiMarkers.clickable, props.cx,
                ] }
                rawProps={ rawProps }
                ref={ ref }
            >
                {getRowContent()}
            </FlexRow>
        );
    },
) as <TItem, TId, TFilter = any>(props: DataTableRowContainerProps<TItem, TId, TFilter> & { ref?: React.ForwardedRef<HTMLDivElement> }) => React.ReactElement;
