import React, { Fragment, useCallback, useMemo } from 'react';
import {
    DataColumnProps, IClickable, IHasCX, IHasRawProps, uuiMarkers, Link, cx,
} from '@epam/uui-core';
import { FlexRow } from '../layout';
import { Anchor } from '../navigation';
import css from './DataTableRowContainer.module.scss';

export interface DataTableRowContainerProps<TItem, TId, TFilter>
    extends IClickable,
    IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>> {
    columns?: DataColumnProps<TItem, TId, TFilter>[];
    renderCell?(column: DataColumnProps<TItem, TId, TFilter>, idx: number, isFirstColumn: boolean, isLastColumn: boolean): React.ReactNode;
    renderConfigButton?(): React.ReactNode;
    overlays?: React.ReactNode;
    link?: Link;
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

function FixedSection<TItem, TId, TFilter>({
    columns,
    direction,
    hasScrollingSection,
    renderConfigButton,
    renderCells,
}: {
    columns: DataColumnProps<TItem, TId, TFilter>[];
    direction: 'left' | 'right';
    hasScrollingSection: boolean;
    renderCells: (columns: DataColumnProps<TItem, TId, TFilter>[]) => React.ReactNode[];
    renderConfigButton?(): React.ReactNode;
}) {
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
            {direction === 'right' && renderConfigButton && renderConfigButton()}
        </div>
    );
}

function ScrollingSection<TItem, TId, TFilter>({
    columns,
    renderCells,
}: {
    columns: DataColumnProps<TItem, TId, TFilter>[]
    renderCells: (columns: DataColumnProps<TItem, TId, TFilter>[]) => React.ReactNode[];
}) {
    return (
        <div className={ cx(css.section, css.scrollingSection, uuiDataTableRowCssMarkers.uuiTableScrollingSection) } style={ getSectionStyle(columns, 1) }>
            {renderCells(columns)}
        </div>
    );
}

export const groupColumns = <TItem, TId, TFilter>(columns: DataColumnProps<TItem, TId, TFilter>[]) => {
    const fixedLeftColumns: DataColumnProps<TItem, TId, TFilter>[] = [];
    const fixedRightColumns: DataColumnProps<TItem, TId, TFilter>[] = [];
    const scrollingColumns: DataColumnProps<TItem, TId, TFilter>[] = [];

    for (const column of columns) {
        if (column.fix === 'left') {
            fixedLeftColumns.push(column);
        } else if (column.fix === 'right') {
            fixedRightColumns.push(column);
        } else {
            scrollingColumns.push(column);
        }
    }

    return {
        fixedLeftColumns,
        fixedRightColumns,
        scrollingColumns,
    };
};

export const DataTableRowContainer = React.forwardRef(
    <TItem, TId, TFilter>(props: DataTableRowContainerProps<TItem, TId, TFilter>, ref: React.ForwardedRef<HTMLDivElement>) => {
        const { fixedLeftColumns, scrollingColumns, fixedRightColumns } = useMemo(
            () => groupColumns(props.columns),
            [props.columns],
        );

        const firstColumn = fixedLeftColumns.at(0)
             || scrollingColumns.at(0)
             || fixedRightColumns.at(0);
        const lastColumn = fixedRightColumns.at(-1)
            || scrollingColumns.at(-1)
            || fixedLeftColumns.at(-1);

        const renderCells = useCallback((columns: DataColumnProps<TItem, TId, TFilter>[]) => {
            return columns.map<React.ReactNode>((column, index) => {
                const isFirstColumn = firstColumn === column;
                const isLastColumn = lastColumn === column;
                return props.renderCell(column, index, isFirstColumn, isLastColumn);
            });
        }, [props.renderCell, firstColumn, lastColumn]);

        function getRowContent() {
            const hasScrollingSection = scrollingColumns.length > 0;

            return (
                <Fragment>
                    {fixedLeftColumns.length > 0 && (
                        <FixedSection
                            columns={ fixedLeftColumns }
                            direction="left"
                            hasScrollingSection={ hasScrollingSection }
                            renderConfigButton={ props.renderConfigButton }
                            renderCells={ renderCells }
                        />
                    )}
                    <ScrollingSection
                        columns={ scrollingColumns }
                        renderCells={ renderCells }
                    />
                    {fixedRightColumns.length > 0 && (
                        <FixedSection
                            columns={ fixedRightColumns }
                            direction="right"
                            hasScrollingSection={ hasScrollingSection }
                            renderConfigButton={ props.renderConfigButton }
                            renderCells={ renderCells }
                        />
                    )}
                    {props.overlays}
                </Fragment>
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
