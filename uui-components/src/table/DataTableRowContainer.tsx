import React from 'react';
import {
    DataColumnProps, IClickable, IHasCX, IHasRawProps, uuiMarkers, Link, cx,
    DndEventHandlers, DataColumnGroupProps, isEventTargetInsideClickable,
} from '@epam/uui-core';
import { Anchor } from '../navigation';
import { getGroupsWithColumns, isGroupOfColumns } from './columnsConfigurationModal/columnsGroupsUtils';
import css from './DataTableRowContainer.module.scss';

export interface DataTableRowContainerProps<TItem, TId, TFilter>
    extends IClickable,
    IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>> {
    /** Columns groups configuration */
    columnGroups?: DataColumnGroupProps[];
    columns?: DataColumnProps<TItem, TId, TFilter>[];
    renderCell?(column: DataColumnProps<TItem, TId, TFilter>, idx: number, eventHandlers?: DndEventHandlers): React.ReactNode;
    /** Columns group cell render function. */
    renderGroupCell?(group: DataColumnGroupProps, idx: number, firstColumnIdx: number, lastColumnIdx: number): React.ReactNode;
    renderConfigButton?(): React.ReactNode;
    overlays?: React.ReactNode;
    link?: Link;
    
    /**
     * Drag'n'drop marker event handlers.
     */
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

enum SectionType {
    Fixed = 1,
    Scrolling = 2,
    Group = 3,
    Table = 4
}

// Scrolling/Fixed sections wrappers, as well as the whole row itself, has to have matching flex-item parameters.
// This is required to have the same width, as the sum of column's width, and grow in the same proportion, as columns inside.
// E.g. for 2 columns: { width: 100, grow: 0 }, { width: 200, grow: 1 } we compute { width: 300, grow: 1 }
// For scrollingSection and for the whole table, we put at least grow=1 - to make the table occupy full width, even if there's no columns with grow > 0.
function getSectionStyle(columns: DataColumnProps[], type: SectionType) {
    let grow = 0;
    let width = 0;

    columns.forEach((column) => {
        let columnWidth;
        if (typeof column.width === 'number') {
            // As columns border's are overlap to collapse borders, effective width of each cell is less by CELL_BORDER_WIDTH
            columnWidth = column.width - CELL_BORDER_WIDTH;
        } else if (typeof column.minWidth === 'number') {
            columnWidth = column.minWidth;
        } else {
            columnWidth = 0;
        }

        width += columnWidth;

        grow += typeof column.grow === 'number' ? column.grow : 0;
    });

    // For fixed sections we keep 1 border width for a transparent border on the edge, so borders on scrolling section can be visible through it
    if (width > 0 && type === SectionType.Fixed) {
        width += CELL_BORDER_WIDTH;
    }

    const minGrow = type === SectionType.Scrolling ? 1 : 0;
    grow = Math.max(grow, minGrow);

    return {
        flex: `${grow} 0 ${width}px`,
        minWidth: `${width}px`,
        '--uui-dt-cell-border-width': `${CELL_BORDER_WIDTH}px`,
    };
}

export const DataTableRowContainer = React.forwardRef(
    <TItem, TId, TFilter>(props: DataTableRowContainerProps<TItem, TId, TFilter>, ref: React.ForwardedRef<HTMLDivElement>) => {
        const { onPointerDown, onTouchStart, ...restRawProps } = props.rawProps ?? {};

        function renderCells(columns: DataColumnProps<TItem, TId, TFilter>[]) {
            if (!props.columnGroups) {
                return columns.map((column) => {
                    const idx = props.columns?.indexOf(column) || 0;
                    return props.renderCell(column, idx, { onPointerDown, onTouchStart });
                });
            }

            const columnsWithGroups = getGroupsWithColumns(props.columnGroups, columns);
            return columnsWithGroups.map((item, index) => {
                if (isGroupOfColumns(item)) {
                    const firstColumnIdx = props.columns?.indexOf(item.columns[0]) || 0;
                    const lastColumnIdx = props.columns?.indexOf(item.columns[item.columns.length - 1]) || 0;

                    return (
                        <div style={ getSectionStyle(item.columns, SectionType.Group) } className={ cx(css.section, 'uui-table-column-group-wrapper') }>

                            {props.renderGroupCell(item.group, index, firstColumnIdx, lastColumnIdx)}
                            <div className={ css.groupColumnsWrapper }>
                                {
                                    item.columns.map((column) => {
                                        const idx = props.columns?.indexOf(column) || 0;
                                        return props.renderCell(column, idx, { onPointerDown, onTouchStart });
                                    })
                                }
                            </div>
                        </div>
                    );
                }

                const idx = props.columns?.indexOf(item) || 0;
                return props.renderCell(item, idx, { onPointerDown, onTouchStart });
            });
        }

        function wrapFixedSection(columns: DataColumnProps<TItem, TId, TFilter>[], direction: 'left' | 'right', hasScrollingSection: boolean) {
            return (
                <div
                    style={ getSectionStyle(columns, SectionType.Fixed) }
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
                <div
                    className={ cx(css.section, css.scrollingSection, uuiDataTableRowCssMarkers.uuiTableScrollingSection) }
                    style={ getSectionStyle(columns, SectionType.Scrolling) }
                >
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
        const minWidth = getSectionStyle(props.columns, SectionType.Table).minWidth;

        const rawProps = {
            ...restRawProps,
            style: { ...restRawProps?.style, minWidth },
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
            <div
                onClick={ props.onClick ? (e) => !isEventTargetInsideClickable(e) && props.onClick(e) : undefined }
                className={ cx(
                    css.container,
                    uuiDataTableRowCssMarkers.uuiTableRowContainer,
                    props.onClick && uuiMarkers.clickable,
                    props.cx,
                ) }
                { ...rawProps }
                ref={ ref }
            >
                {getRowContent()}
            </div>
        );
    },
) as <TItem, TId, TFilter = any>(props: DataTableRowContainerProps<TItem, TId, TFilter> & { ref?: React.ForwardedRef<HTMLDivElement> }) => React.ReactElement<any>;
